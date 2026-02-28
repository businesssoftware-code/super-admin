"use client";

import { getErrorMessage, privateApi } from "@/app/libs/axios";
import { formatDateDifference, formatDateWithOrdinal, formatDateWithShort, getTodaysDate } from "@/app/libs/functions";
import {
  ApiOutlet,
  TypeOfOutletDashboard,
  TypeOfStageIndicators,
} from "@/app/libs/types";
import React, { useState } from "react";
import { toast } from "sonner";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type LOIStatus = "Uploaded" | "Missing" | "Updated";
type NotifType = "urgent" | "warning" | "success" | "info";
type FilterType =
  | "All"
  | "On-Hold"
  | "Cancelled"
  | "Completed"
  | "In-Progress"
  | "Urgent";
type TabId = "pending" | "approved" | "rejected";






interface RejectedOutlet {
  id: number;
  name: string;
  area: string;
  warehouse: string;
  submittedBy: string;
  rejectedDate: string;
  rejectedBy: string;
  rentAmount: number;
  sdAmount: number;
  loiStatus: LOIStatus;
  reason: string;
}

interface Notification {
  id: number;
  type: NotifType;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface ConfirmModal {
  outlet: ApiOutlet;
  action: "Approved" | "Rejected";
}

interface Toast {
  msg: string;
  type: "success" | "error";
}

interface UrgencyStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

interface LOIStyle {
  bg: string;
  text: string;
}

interface NotifTypeStyle {
  dot: string;
  bg: string;
}

interface PhaseColor {
  bg: string;
  text: string;
  dot: string;
}

interface Tab {
  id: TabId;
  label: string;
  count: number;
  color: string;
}

interface KPICard {
  label: string;
  value: number;
  border: string;
  icon: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const colors = {
  primary: "#063312",
  secondary: "#CBFF99",
  secondarySurface: "#F0F0E8",
  info: "#204877",
  accent: "#D5F3FF",
  neutralText: "#848484",
  neutralBg: "#CCCABC",
  white: "#FFFFFF",
} as const;

const fmt = (n: number): string => "₹" + n.toLocaleString("en-IN");

const PHASES: string[] = [
  "Agreement Signed",
  "Fit-out In Progress",
  "Stock Loaded",
  "Trial Run",
  "Live",
];



const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "urgent",
    icon: "🚨",
    title: "Sunrise Mart is overdue",
    body: "5 days pending — immediate review required.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "urgent",
    icon: "🚨",
    title: "Green Valley Store overdue",
    body: "4 days pending — LOI uploaded and awaiting decision.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    icon: "⚠️",
    title: "LOI Missing — Metro Express",
    body: "Outlet submission incomplete. LOI not uploaded yet.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "success",
    icon: "✅",
    title: "TechMart Plus approved",
    body: "Approved yesterday. Currently in Trial Run phase.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: "📋",
    title: "Heritage Kirana submitted",
    body: "Heritage Kirana submitted by Suresh Patel (Central Zone).",
    time: "3 days ago",
    read: true,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getUrgencyColor = (days: number): UrgencyStyle => {
  if (days < 2)
    return {
      bg: "#EBFFD6",
      text: "#063312",
      border: "#CBFF99",
      label: `${days}d pending`,
    };
  if (days <= 3)
    return {
      bg: "#FFFDE0",
      text: "#6B5D00",
      border: "#FFFC83",
      label: `${days}d pending`,
    };
  return {
    bg: "#FDE8EC",
    text: "#721426",
    border: "#F5A0B0",
    label: `${days}d — Overdue`,
  };
};

const loiStatusStyle = (s: LOIStatus): LOIStyle =>
  s === "Uploaded"
    ? { bg: "#EBFFD6", text: "#063312" }
    : s === "Missing"
      ? { bg: "#FDE8EC", text: "#721426" }
      : { bg: "#D5F3FF", text: "#204877" };

const notifTypeStyle = (t: NotifType): NotifTypeStyle =>
  t === "urgent"
    ? { dot: "#721426", bg: "#FDE8EC" }
    : t === "warning"
      ? { dot: "#B89500", bg: "#FFFDE0" }
      : t === "success"
        ? { dot: "#2E7D32", bg: "#EBFFD6" }
        : { dot: "#204877", bg: "#D5F3FF" };

type TypeOngoingProgressProps = {
  overallProgress: number;
};
const OngoingProgress: React.FC<TypeOngoingProgressProps> = ({
  overallProgress,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#204877",
          }}
        >
          {"Progress"}
        </span>
        <span style={{ fontSize: 10, color: colors.info, fontWeight: 700 }}>
          {overallProgress}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#F0F0E8",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${overallProgress}%`,
            background: colors?.secondary,
            borderRadius: 10,
            transition: "width 0.4s",
          }}
        />
      </div>
    </div>
  );
};

type TypePhaseStepperProps = {
  stageIndicators: TypeOfStageIndicators[];
};
const PhaseStepper: React.FC<TypePhaseStepperProps> = ({ stageIndicators }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {stageIndicators?.map((p, i) => {
      const progress = p?.progress ?? 0;
      const done = progress === 100;
      const active = progress > 0 && progress < 100;

      return (
        <React.Fragment key={p.stageName}>
          {/* Step */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Stage Name */}
            <div style={{ marginBottom: 8, fontSize: 12 }}>{p.stageName}</div>

            {/* Circle */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: done
                  ? colors.secondary
                  : active
                    ? colors.primary
                    : "#F0F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: done ? colors.primary : active ? "#ffffff" : "#0000000",
              }}
            >
              {done ? "✓" : i + 1}
            </div>
          </div>

          {/* Connector */}
          {i < stageIndicators.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background:
                  stageIndicators[i]?.progress === 100 ? "#CBFF99" : "#F0F0E8",
                margin: "0 8px",
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

type TypeOfPageProps = {
  onboardedOutlets: ApiOutlet[];
  dashboardData: TypeOfOutletDashboard;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function App({
  onboardedOutlets,
  dashboardData,
}: TypeOfPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [loiPanelOpen, setLoiPanelOpen] = useState<boolean>(false);
  const [loiOutlet, setLoiOutlet] = useState<ApiOutlet | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [comment, setComment] = useState<string>("");

  //outlets
  const [outlets, setOutlets] = useState<ApiOutlet[]>(onboardedOutlets);

  //dashboardData
  const [dashboard, setDashboard] = useState<TypeOfOutletDashboard | null>(
    dashboardData,
  );

  const handleFetch = async () => {
    const toastId = toast.loading("Fetching the outlets data...");

    try {
      const [responseOfOultets, responseOfDashboard] = await Promise.all([
        privateApi.get("/nso/outlets"),
        privateApi.get("/outlets/nso/dashboard"),
      ]);

      if (
        responseOfOultets?.status === 201 &&
        responseOfDashboard?.status === 200
      ) {
        const mappedOutlets = responseOfOultets?.data?.map((el: ApiOutlet) => ({
         
          outletId: el?.outletId,
              outletName: el?.outletName,
              outletStatus: el?.outletStatus==="draft" ? "Pending": (el?.outletStatus==="approved" ? "Approved": "Rejected"),
              expectedDate: el?.expectedDate
                ? formatDateWithOrdinal(el.expectedDate)
                : "",
              actualDate: el?.actualDate ? formatDateWithOrdinal(el.actualDate) : "",
              address: el?.address ?? "",
              fixedRentAmount: el?.fixedRentAmount ?? 0,
              sdAmount: el?.sdAmount ?? 0,
              revSharePercent: el?.revSharePercent ?? 0,
              rentModel: el?.rentModel ?? "",
              city: el?.city ?? "",
              status: el?.status ?? "",
              daysPendingForLOIApproval: el?.outletStatus==="draft" ? formatDateDifference(getTodaysDate(), getTodaysDate(el?.createdAt)): 0,
              stageIndicators: el?.stageIndicators ?? [],
              overallProgress: el?.overallProgress ?? 0,
              approvedDate: formatDateWithOrdinal(el?.approvedDate ?? "") ?? "",
              loiDocument: el?.loiDocument ?? "",
              rejectionReason: el?.rejectionReason ?? "",
              createdAt: formatDateWithShort(el?.createdAt ?? "") ?? "",
              areaManager: el?.areaManager ?? "",

        }));

        setOutlets(mappedOutlets);
        setDashboard(responseOfDashboard.data);

        toast.dismiss(toastId);
      } else {
        toast.error("Something went wrong", { id: toastId, duration: 3000 });
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || "An error occurred.", {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (
    stage: string,
    outletId: number,
    reason?: string,
  ) => {
    const toastId = toast.loading(
      stage === "approval" ? "Approving outlet..." : "Rejecting outlet...",
    );

    const payload = stage === "approval" ? {} : { rejectionReason: reason };

    try {
      const response = await privateApi.patch(
        `/outlets/${outletId}/${stage}`,
        payload,
      );

      console.log(response, "responseresponse");

      if (response?.status === 201) {
        toast.success(
          stage === "approval"
            ? "Outlet approved successfully."
            : "Outlet rejected!.",
          { id: toastId, duration: 3000 },
        );

        setTimeout(() => {
          toast.dismiss(toastId);
          handleFetch();
        }, 1000);
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || "An error occurred.", {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const handleDecision = async (
    id: number,
    decision: "Approved" | "Rejected",
  ) => {
    const outlet = outlets.find((o) => o.outletId === id);

    if (!outlet) return;

    if (decision === "Approved") {
      handleSubmit("approval", outlet.outletId);
    } else {
      handleSubmit("reject", outlet.outletId, comment);
    }
    setConfirmModal(null);
    setLoiPanelOpen(false);
    setComment("");
  };

  const openConfirm = (
    outlet: ApiOutlet,
    action: ConfirmModal["action"],
  ): void => {
    setConfirmModal({
      outlet: {
        ...outlet,
        outletId: outlet.outletId,
      },
      action,
    });

    setComment("");
  };

  const tabs: Tab[] = [
    {
      id: "pending",
      label: "Pending",
      count: outlets?.filter((o) => o.outletStatus === "Pending")?.length ?? 0,
      color: "#FFFC83",
    },
    {
      id: "approved",
      label: "Approved",
      count: outlets?.filter((o) => o.outletStatus === "Approved")?.length ?? 0,
      color: "#CBFF99",
    },
    {
      id: "rejected",
      label: "Rejected",
      count: outlets?.filter((o) => o.outletStatus === "Rejected")?.length ?? 0,
      color: "#FDE8EC",
    },
  ];

  const kpiCards: KPICard[] = [
    {
      label: "Pending Approvals",
      value: dashboard?.stats?.pendingApprovals ?? 0,
      border: "#FFFC83",
      icon: "⏳",
    },
    {
      label: "Urgent (>3 Days)",
      value: dashboard?.stats?.urgent ?? 0,
      border: "#721426",
      icon: "🚨",
    },
    {
      label: "Approved Today",
      value: dashboard?.stats?.approvedToday ?? 0,
      border: "#CBFF99",
      icon: "✅",
    },
    {
      label: "Rejected Today",
      value: dashboard?.stats?.rejectedToday ?? 0,
      border: "#204877",
      icon: "❌",
    },
    {
      label: "Live Outlets",
      value: dashboard?.stats?.liveOutlets ?? 0,
      border: "#063312",
      icon: "🟢",
    },
  ];

  
  const handleViewLOI  = (LOIPdf: string) => {
 
    if(!LOIPdf) return;
    window.open(LOIPdf, "_blank", "noopener,noreferrer");

  }


  const handleRentModelName = (rentModel: string) => {
    return rentModel==="fixedRent" ? "Fixed Rent" : (rentModel==="fixedRentWithRevShare" ? "Fixed Rent + Revenue Share" : (rentModel==="revShare" ? "Revenue Share" : ""));
  }


  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#F8F8F4",
        minHeight: "100vh",
        color: colors.primary,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: colors.secondary,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          height: 64,
          boxShadow: "0 2px 12px rgba(6,51,18,0.18)",
          position: "relative",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="text-primary text-heading4"
            style={{ fontWeight: 500 }}
          >
            Outlets
          </span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: colors.primary,
              border: "1px solid rgba(203,255,153,0.25)",
              borderRadius: 20,
              padding: "6px 14px",
              color: colors.secondary,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {dashboard?.stats?.pendingApprovals ?? 0} Pending
          </div>
          {/* <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen(o => !o)}
              style={{ width: 40, height: 40, borderRadius: "50%", background: notifOpen ? colors.secondary : "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <BellIcon size={18} color={notifOpen ? colors.primary : "white"} />
              {unreadCount > 0 && <div style={{ position: "absolute", top: 5, right: 5, width: 17, height: 17, background: "#721426", borderRadius: "50%", border: "2px solid " + colors.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{unreadCount > 9 ? "9+" : unreadCount}</div>}
            </button>
            {notifOpen && (
              <>
                <div onClick={() => setNotifOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
                <div style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: 390, background: colors.white, borderRadius: 20, boxShadow: "0 20px 70px rgba(6,51,18,0.18)", border: `1px solid ${colors.secondarySurface}`, overflow: "hidden", zIndex: 99 }}>
                  <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${colors.secondarySurface}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: colors.primary }}>Notifications</span>
                        {unreadCount > 0 && <span style={{ background: "#721426", color: "white", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{unreadCount} new</span>}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 11, color: colors.info, fontWeight: 700, background: colors.accent, border: "none", cursor: "pointer", padding: "5px 10px", borderRadius: 8 }}>Mark all read</button>}
                        <button onClick={() => setNotifications([])} style={{ fontSize: 11, color: colors.neutralText, fontWeight: 600, background: colors.secondarySurface, border: "none", cursor: "pointer", padding: "5px 10px", borderRadius: 8 }}>Clear</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["All", "Unread", "Urgent"] as FilterType[]).map(f => (
                        <button key={f} onClick={() => setNotifFilter(f)} style={{ padding: "5px 14px", borderRadius: 20, border: "none", background: notifFilter === f ? colors.primary : colors.secondarySurface, color: notifFilter === f ? colors.secondary : colors.neutralText, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          {f}{f === "Unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {filteredNotifs.length === 0 ? (
                      <div style={{ padding: "40px 20px", textAlign: "center", color: colors.neutralText }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: colors.primary }}>All caught up!</div>
                      </div>
                    ) : filteredNotifs.map((n: Notification) => {
                      const ns = notifTypeStyle(n.type);
                      return (
                        <div key={n.id} onClick={() => markRead(n.id)}
                          style={{ padding: "13px 20px 13px 26px", borderBottom: `1px solid ${colors.secondarySurface}`, display: "flex", gap: 12, cursor: "pointer", background: n.read ? "transparent" : "#F5FFF0", position: "relative" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#F2F5F0")}
                          onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : "#F5FFF0")}>
                          {!n.read && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: ns.dot, borderRadius: "0 4px 4px 0" }} />}
                          <div style={{ width: 38, height: 38, borderRadius: 12, background: ns.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: n.read ? 600 : 800, fontSize: 13, color: colors.primary, marginBottom: 2 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: colors.neutralText, marginBottom: 3 }}>{n.body}</div>
                            <div style={{ fontSize: 11, color: colors.neutralBg }}>{n.time}</div>
                          </div>
                          {!n.read && <button onClick={e => { e.stopPropagation(); markRead(n.id); }} style={{ width: 26, height: 26, borderRadius: 7, border: `1.5px solid ${colors.secondarySurface}`, background: "white", cursor: "pointer", flexShrink: 0, fontSize: 13 }}>✓</button>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: "10px 20px", background: colors.secondarySurface }}>
                    <div style={{ fontSize: 11, color: colors.neutralText, textAlign: "center" }}>Auto-generated from outlet activity & urgency thresholds</div>
                  </div>
                </div>
              </>
            )}
          </div> */}
          {/* <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 16 }}>👤</div> */}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1320, margin: "0 auto" }}>
        {/* ── KPI CARDS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {kpiCards.map((card: KPICard, i: number) => (
            <div
              key={i}
              style={{
                background: colors.white,
                borderRadius: 20,
                padding: "18px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                borderTop: `4px solid ${card.border}`,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: colors.primary,
                  lineHeight: 1,
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: colors.neutralText,
                  marginTop: 5,
                  fontWeight: 500,
                }}
              >
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB NAV ── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            background: colors.white,
            borderRadius: 16,
            padding: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            width: "fit-content",
          }}
        >
          {tabs.map((tab: Tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 22px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                background:
                  activeTab === tab.id ? colors.primary : "transparent",
                color:
                  activeTab === tab.id ? colors.secondary : colors.neutralText,
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              <span
                style={{
                  background:
                    activeTab === tab.id ? "rgba(203,255,153,0.2)" : tab.color,
                  color:
                    activeTab === tab.id ? colors.secondary : colors.primary,
                  borderRadius: 20,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ══ PENDING TAB ══ */}
        {activeTab === "pending" && (
          <>
            {outlets?.filter((el) => el.daysPendingForLOIApproval > 2)?.length >
              0 && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#721426",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  <span
                    style={{ fontWeight: 800, fontSize: 15, color: "#721426" }}
                  >
                    Urgent Requirements :{" "}
                  </span>
                  <span
                    style={{
                      background: "#FDE8EC",
                      color: "#721426",
                      borderRadius: 20,
                      padding: "2px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {dashboard?.immediateApprovals?.length ?? 0} urgent
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 6,
                  }}
                >
                  {outlets
                    ?.filter((el) => el.daysPendingForLOIApproval > 2)
                    ?.map((outlet: ApiOutlet) => {
                      const urg = getUrgencyColor(
                        outlet.daysPendingForLOIApproval,
                      );
                      return (
                        <div
                          key={outlet.outletId}
                          style={{
                            minWidth: "calc((100% - 28px) / 3)",
                            flex: "0 0 auto",
                            background: colors.white,
                            borderRadius: 20,
                            padding: "18px 20px",
                            boxShadow: "0 4px 20px rgba(114,20,38,0.1)",
                            border: `1.5px solid ${urg.border}`,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              background: `linear-gradient(90deg, ${urg.border}, transparent)`,
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: colors.primary,
                                }}
                              >
                                {outlet?.outletName}
                              </div>
                              <div
                                style={{
                                  color: colors.neutralText,
                                  fontSize: 11,
                                  marginTop: 2,
                                }}
                              >
                                {outlet?.city}
                              </div>
                            </div>
                            <div
                              style={{
                                background: urg.bg,
                                color: urg.text,
                                borderRadius: 20,
                                padding: "3px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {urg.label}
                            </div>
                          </div>
                          {/* <div style={{ fontSize: 11, color: colors.neutralText, marginBottom: 10 }}>By <strong style={{ color: colors.primary }}>{outlet.submittedBy}</strong> · {outlet.submittedDate}</div> */}
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            {(outlet?.rentModel==="fixedRent" || outlet?.rentModel==="fixedRentWithRevShare") && <div
                              style={{
                                flex: 1,
                                background: colors.secondarySurface,
                                borderRadius: 10,
                                padding: "7px 12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 9,
                                  color: colors.neutralText,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px",
                                  marginBottom: 2,
                                }}
                              >
                                Rent/mo
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: colors.primary,
                                }}
                              >
                                {fmt(outlet.fixedRentAmount)}
                              </div> 
                            </div>}


                            {(outlet?.rentModel==="revShare" || outlet?.rentModel==="fixedRentWithRevShare") && <div
                              style={{
                                flex: 1,
                                background: colors.secondarySurface,
                                borderRadius: 10,
                                padding: "7px 12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 9,
                                  color: colors.neutralText,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px",
                                  marginBottom: 2,
                                }}
                              >
                                Revenue Share
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: colors.primary,
                                }}
                              >
                                {outlet?.revSharePercent+"%"}
                              </div> 
                            </div>}



                            <div
                              style={{
                                flex: 1,
                                background: "#D5F3FF",
                                borderRadius: 10,
                                padding: "7px 12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "#204877",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px",
                                  marginBottom: 2,
                                }}
                              >
                                SD
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: "#204877",
                                }}
                              >
                                {fmt(outlet.sdAmount)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => {
                                setLoiOutlet(outlet);
                                setLoiPanelOpen(true);
                              }}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 10,
                                border: `1.5px solid ${colors.primary}`,
                                background: "transparent",
                                color: colors.primary,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              View LOI
                            </button>
                            <button
                              onClick={() => {
                                openConfirm(outlet, "Approved");
                              }}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 10,
                                border: "none",
                                background: colors.secondary,
                                color: colors.primary,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirm(outlet, "Rejected")}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 10,
                                border: "none",
                                background: "#FDE8EC",
                                color: "#721426",
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div
              style={{
                background: colors.white,
                borderRadius: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: `1px solid ${colors.secondarySurface}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  All Pending Approvals
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["All", "Urgent"] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 20,
                        border: "none",
                        background:
                          activeFilter === f
                            ? colors.primary
                            : colors.secondarySurface,
                        color:
                          activeFilter === f
                            ? colors.secondary
                            : colors.neutralText,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 900,
                  }}
                >
                  <thead>
                    <tr style={{ background: colors.secondarySurface }}>
                      {[
                        "Date",
                        "Outlet Name",
                        "Location",
                        "Area Manager",
                        "Rent Model",
                        "Rent / Month",
                        "Revenue Share",
                        "Rent + Revenue Share",
                        "Security Deposit",
                        "LOI Status",
                        "Days Pending",
                        "Actions",
                      ].map((h: string) => (
                        <th
                          key={h}
                          style={{
                            padding: "11px 18px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            color: colors.neutralText,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outlets
                      ?.filter(
                        (o: ApiOutlet) =>
                          o.outletStatus === "Pending" &&
                          (activeFilter === "All" ||
                            (activeFilter === "Urgent"
                              ? o.daysPendingForLOIApproval > 2
                              : o.daysPendingForLOIApproval <= 2)),
                      )
                      ?.map((outlet: ApiOutlet) => {
                        const urg = getUrgencyColor(
                          outlet.daysPendingForLOIApproval,
                        );
                        const loiS = loiStatusStyle(
                          outlet.outletStatus === "Pending"
                            ? "Missing"
                            : "Uploaded",
                        );
                        return (
                          <tr
                            key={outlet.outletId}
                            style={{
                              borderBottom: `1px solid ${colors.secondarySurface}`,
                              transition: "background 0.12s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#FAFAF7")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >

                            <td style={{ padding: "13px 18px" }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 13,
                                  color: colors.primary,
                                }}
                              >
                                {outlet.createdAt ?? "-"}
                              </div>
                              {/* <div style={{ fontSize: 10, color: colors.neutralText }}>{outlet.warehouse}</div> */} 
                            </td>

                            <td style={{ padding: "13px 18px" }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 13,
                                  color: colors.primary,
                                }}
                              >
                                {outlet.outletName}
                              </div>
                              {/* <div style={{ fontSize: 10, color: colors.neutralText }}>{outlet.warehouse}</div> */} 
                            </td>
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.neutralText,
                              }}
                            >
                              {outlet.city}
                            </td>
                             {/* area manager */}
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.neutralText,
                              }}
                            >
                              {outlet.areaManager}
                            </td>


                             {/* rent model*/}
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.neutralText,
                              }}
                            >
                              {handleRentModelName(outlet?.rentModel)}
                            </td>


                            {/* rent model*/}
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.primary,
                                fontWeight: 700,
                              }}
                            >

                                {outlet?.rentModel==="fixedRent" && fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount)))}
                              
                            </td>

                            {/*revenue share*/}
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.primary,
                                fontWeight: 700,
                              }}
                            >

                                {outlet?.rentModel==="revShare" && outlet?.revSharePercent+"%"}
                              
                            </td>



                            {/*rent + revenue share*/}
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: 12,
                                color: colors.primary,
                                fontWeight: 700,
                              }}
                            >

                                {outlet?.rentModel==="fixedRentWithRevShare" && (
                                  fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount)))
                                  +
                                  " + " +
                                  outlet?.revSharePercent+"%"
                                )}
                              
                            </td>

                          

                         {/* SD amount */}
                            <td style={{ padding: "13px 18px" }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 12,
                                  color: "#204877",
                                }}
                              >
                                {fmt(isNaN(Number(outlet?.sdAmount)) ? 0 : (Number(outlet?.sdAmount)))}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: colors.neutralText,
                                }}
                              >
                                one-time
                              </div>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <span
                                style={{
                                  background: loiS.bg,
                                  color: loiS.text,
                                  borderRadius: 20,
                                  padding: "3px 10px",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                              >
                                {outlet.loiDocument
                                  ? "Uploaded"
                                  : "Missing"}
                              </span>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <span
                                style={{
                                  background: urg.bg,
                                  color: urg.text,
                                  borderRadius: 20,
                                  padding: "3px 10px",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                              >
                                {urg.label}
                              </span>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ display: "flex", gap: 5 }}>
                                <button
                                  onClick={() => {
                                    setLoiOutlet(outlet);
                                    setLoiPanelOpen(true);
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: 7,
                                    border: `1.5px solid ${colors.primary}`,
                                    background: "transparent",
                                    color: colors.primary,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  LOI
                                </button>
                                <button
                                  onClick={() =>
                                    openConfirm(outlet, "Approved")
                                  }
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: 7,
                                    border: "none",
                                    background: colors.secondary,
                                    color: colors.primary,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() =>
                                    openConfirm(outlet, "Rejected")
                                  }
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: 7,
                                    border: "none",
                                    background: "#FDE8EC",
                                    color: "#721426",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ══ APPROVED TAB ══ */}
        {activeTab === "approved" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  Approved Outlets
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.neutralText,
                    marginTop: 2,
                  }}
                >
                  Track approval history and ongoing launch status
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(
                  [
                    "All",
                    "In-Progress",
                    "On-Hold",
                    "Completed",
                    "Cancelled",
                  ] as FilterType[]
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "none",
                      background:
                        activeFilter === f
                          ? colors.primary
                          : colors.secondarySurface,
                      color:
                        activeFilter === f
                          ? colors.secondary
                          : colors.neutralText,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {outlets
                ?.filter(
                  (a: ApiOutlet) =>
                    a.outletStatus === "Approved" &&
                    (activeFilter === "All" ||
                      (activeFilter === "In-Progress"
                        ? a.status === "onTrack" || a.status === "inProgress"
                        : activeFilter === "On-Hold"
                          ? a.status === "onHold"
                          : activeFilter === "Completed"
                            ? a.status === "completed"
                            : a.status === "cancelled")),
                )
                .map((outlet: ApiOutlet) => {
                  const isLive: boolean = activeFilter === "In-Progress";
                  return (
                    <div
                      key={outlet.outletId}
                      style={{
                        background: colors.white,
                        borderRadius: 20,
                        padding: "20px 24px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        border: `1.5px solid ${isLive ? "#CBFF99" : colors.secondarySurface}`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isLive && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background:
                              "linear-gradient(90deg, #CBFF99, #063312)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: 20,
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 4,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 15,
                                color: colors.primary,
                              }}
                            >
                              {outlet.outletName}
                            </div>
                            {isLive && (
                              <span
                                style={{
                                  background: "#CBFF99",
                                  color: "#063312",
                                  borderRadius: 20,
                                  padding: "2px 10px",
                                  fontSize: 10,
                                  fontWeight: 800,
                                }}
                              >
                                🟢 LIVE
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: colors.neutralText,
                              marginBottom: 8,
                            }}
                          >
                            {outlet?.city}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 16,
                              marginBottom: 14,
                              flexWrap: "wrap",
                            }}
                          >
                            {(
                              [
                                {
                                  label: "APPROVED DATE",
                                  value: outlet?.approvedDate, 
                                  color: colors.primary,
                                },
                                {
                                  label: "APPROVED BY",
                                  value: "Admin",
                                  color: colors.primary,
                                },
                                {
                                  label: "RENT MODEL",
                                  value: handleRentModelName(outlet?.rentModel),
                                  color: colors.primary,
                                },
                                {
                                  label: "RENT/MONTH",
                                  value: outlet?.rentModel==="fixedRent" && fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount))),
                                  color: colors.primary,
                                },
                                 {
                                  label: "REVENUE SHARE",
                                  value: outlet?.rentModel==="revShare" && outlet?.revSharePercent+"%",
                                  color: colors.primary,
                                },
                                 {
                                  label: "RENT + REVENUE SHARE",
                                  value: outlet?.rentModel==="fixedRentWithRevShare" && (
                                  fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount)))
                                  +
                                  " + " +
                                  outlet?.revSharePercent+"%"
                                ),
                                  color: colors.primary,
                                },
                                {
                                  label: "SECURITY DEPOSIT",
                                  value: fmt(outlet.sdAmount),
                                  color: "#204877",
                                },
                              ] as {
                                label: string;
                                value: string;
                                color: string;
                              }[]
                            ).map(({ label, value, color }) => (
                              <div key={label}>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: colors.neutralText,
                                    fontWeight: 600,
                                  }}
                                >
                                  {label}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color,
                                  }}
                                >
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <PhaseStepper
                              stageIndicators={outlet?.stageIndicators}
                            />
                          </div>
                          <OngoingProgress
                            overallProgress={outlet?.overallProgress ?? 0}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              background: "#EBFFD6",
                              borderRadius: 12,
                              padding: "10px 16px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 9,
                                color: "#063312",
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              Progress
                            </div>
                            <div
                              style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#063312",
                              }}
                            >
                              {outlet?.overallProgress + "%"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ══ REJECTED TAB ══ */}
        {activeTab === "rejected" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{ fontWeight: 800, fontSize: 16, color: colors.primary }}
              >
                Rejection History
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.neutralText,
                  marginTop: 2,
                }}
              >
                Full record of rejected outlet applications with reasons
              </div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {outlets
                ?.filter((el) => el.outletStatus === "Rejected")
                ?.map((outlet: ApiOutlet) => (
                  <div
                    key={outlet.outletId}
                    style={{
                      background: colors.white,
                      borderRadius: 20,
                      padding: "20px 24px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      border: "1.5px solid #FDE8EC",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background:
                          "linear-gradient(90deg, #F5A0B0, transparent)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 15,
                              color: colors.primary,
                            }}
                          >
                            {outlet?.outletName ?? ""}
                          </div>
                          <span
                            style={{
                              background: "#FDE8EC",
                              color: "#721426",
                              borderRadius: 20,
                              padding: "2px 10px",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            ✕ Rejected
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: colors.neutralText,
                            marginBottom: 12,
                          }}
                        >
                          {outlet?.city ?? ""}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            marginBottom: 14,
                            flexWrap: "wrap",
                          }}
                        >
                        
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              REJECTED BY
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              Admin
                            </div>
                          </div>


                          {/* rent model */}
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              RENT MODEL
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {handleRentModelName(outlet?.rentModel)}
                            </div>
                          </div>

                           {/* rent / month */}
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              RENT/MONTH
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {outlet?.rentModel==="fixedRent" && fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount)))}
                            </div>
                          </div>


                          {/* revenue share */}
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              REVENUE SHARE
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {outlet?.rentModel==="revShare" && outlet?.revSharePercent+"%"}
                            </div>
                          </div>

                          {/* Rent + Revenue Share */}
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              RENT + REVENUE SHARE
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {outlet?.rentModel==="fixedRentWithRevShare" && (
                                  fmt(isNaN(Number(outlet?.fixedRentAmount)) ? 0 : (Number(outlet?.fixedRentAmount)))
                                  +
                                  " + " +
                                  outlet?.revSharePercent+"%"
                                )}
                            </div>
                          </div>


                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#204877",
                                fontWeight: 600,
                              }}
                            >
                              SECURITY DEPOSIT
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#204877",
                              }}
                            >
                              {fmt(isNaN(Number(outlet.sdAmount)) ? 0 : (Number(outlet.sdAmount)))}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: colors.neutralText,
                                fontWeight: 600,
                              }}
                            >
                              LOI STATUS
                            </div>
                            <span
                              style={{
                                background: loiStatusStyle(
                                  outlet?.loiDocument ? "Uploaded" : "Missing",
                                ).bg,
                                color: loiStatusStyle(
                                  outlet?.loiDocument ? "Uploaded" : "Missing",
                                ).text,
                                borderRadius: 20,
                                padding: "2px 10px",
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {outlet?.outletStatus}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            background: "#FDE8EC",
                            borderRadius: 12,
                            padding: "12px 16px",
                            borderLeft: "4px solid #721426",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#721426",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: 5,
                            }}
                          >
                            Rejection Reason
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#4A0D1A",
                              lineHeight: 1.6,
                            }}
                          >
                            {outlet?.rejectionReason}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "#FDE8EC",
                            border: "2px solid #F5A0B0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          ✕
                        </div>
                      
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ── LOI PANEL ── */}
      {loiPanelOpen && loiOutlet && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div
            onClick={() => setLoiPanelOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,51,18,0.35)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 480,
              background: colors.white,
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "22px 26px",
                borderBottom: `1px solid ${colors.secondarySurface}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 17,
                      color: colors.primary,
                    }}
                  >
                    {loiOutlet?.outletName}
                  </div>
                  {/* <div style={{ fontSize: 11, color: colors.neutralText, marginTop: 3 }}>Submitted {loiOutlet.submittedDate} by {loiOutlet.submittedBy}</div> */}
                </div>
                <button
                  onClick={() => setLoiPanelOpen(false)}
                  style={{
                    border: "none",
                    background: colors.secondarySurface,
                    borderRadius: 20,
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ flex: 1, padding: "22px 26px", overflow: "auto" }}>
             
              <div
                style={{
                  background: colors.secondarySurface,
                  borderRadius: 14,
                  padding: "36px 28px",
                  textAlign: "center",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px dashed ${colors.neutralBg}`,
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
                <div
                  style={{
                    fontWeight: 700,
                    color: colors.primary,
                    fontSize: 14,
                  }}
                >
                  Letter of Intent
                </div>
                <div
                  style={{
                    color: colors.neutralText,
                    fontSize: 11,
                    marginTop: 5,
                  }}
                >
                  {loiOutlet.outletName} · {loiOutlet?.outletStatus}
                </div>
                 {/* view LOI */}
                <button
                  style={{
                    marginTop: 18,
                    padding: "9px",
                    background: colors.secondary,
                    color: colors.primary,
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}

                  onClick={()=>handleViewLOI(loiOutlet?.loiDocument)}
                >
                  👁 View
                </button>

                {/* Download LOI */}
                <button
                  style={{
                    marginTop: 18,
                    padding: "9px 22px",
                    background: colors.primary,
                    color: colors.secondary,
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ⬇ Download PDF
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "20px 26px",
                borderTop: `1px solid ${colors.secondarySurface}`,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => openConfirm(loiOutlet, "Approved")}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: 14,
                    border: "none",
                    background: colors.secondary,
                    color: colors.primary,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ✓ Approve Outlet
                </button>
                <button
                  onClick={() => openConfirm(loiOutlet, "Rejected")}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: 14,
                    border: "none",
                    background: "#FDE8EC",
                    color: "#721426",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM MODAL ── */}
      {confirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => setConfirmModal(null)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,51,18,0.4)",
              backdropFilter: "blur(6px)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: colors.white,
              borderRadius: 24,
              padding: "30px 34px",
              width: 420,
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{ fontSize: 30, textAlign: "center", marginBottom: 10 }}
            >
              {confirmModal.action === "Approved" ? "✅" : "⚠️"}
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                textAlign: "center",
                color: colors.primary,
                marginBottom: 6,
              }}
            >
              {confirmModal.action === "Approved"
                ? "Approve Outlet?"
                : "Reject Outlet?"}
            </div>
            <div
              style={{
                textAlign: "center",
                color: colors.neutralText,
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              <strong style={{ color: colors.primary }}>
                {confirmModal.outlet?.outletName}
              </strong>{" "}
              will be{" "}
              {confirmModal.action === "Approved"
                ? "approved and moved to launch tracking."
                : "rejected and logged in history."}
            </div>
            {confirmModal.action === "Rejected" && (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Reason for rejection (required)..."
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 11,
                  border: `1.5px solid ${colors.neutralBg}`,
                  fontFamily: "inherit",
                  fontSize: 12,
                  resize: "none",
                  height: 80,
                  marginBottom: 14,
                  boxSizing: "border-box",
                }}
              />
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 11,
                  border: `1.5px solid ${colors.secondarySurface}`,
                  background: "transparent",
                  color: colors.neutralText,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.action === "Rejected" && !comment.trim()) {
                    alert("Please provide a reason.");
                    return;
                  }
                  handleDecision(
                    confirmModal.outlet?.outletId,
                    confirmModal.action,
                  );
                }}
                style={{
                  flex: 2,
                  padding: "11px",
                  borderRadius: 11,
                  border: "none",
                  background:
                    confirmModal.action === "Approved"
                      ? colors.primary
                      : "#721426",
                  color:
                    confirmModal.action === "Approved"
                      ? colors.secondary
                      : "white",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Confirm {confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
