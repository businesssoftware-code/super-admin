"use client";

import { NsoOutletDetail, NsoTask } from "@/app/libs/types";
import { useState } from "react";
import ApprovalModal from "../components/approval-modal";
import DocumentViewerModal from "../components/document-viewer-modal";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { formatDateWithOrdinal } from "@/app/libs/functions";
import { getErrorMessage, privateApi } from "@/app/libs/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface OutletDetailPageProps {
  data?: NsoOutletDetail;
}

const OutletDetailPage = ({ data }: OutletDetailPageProps) => {
  const router = useRouter();
  const outlet = data?.outlet;
  const project = data?.project;
  const stages = data?.stages ?? [];

  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [remarks, setRemarks] = useState("");

  // 🔹 unified document preview state
  const [docPreview, setDocPreview] = useState<{
    open: boolean;
    title?: string;
    url?: string;
  }>({
    open: false,
  });

  const closeApprovalModal = () => {
    setAction(null);
    setRemarks("");
  };

  const handleSubmit = async() => {
  const toastId = toast.loading(
      action === "approve"
        ? "Approving outlet..."
        : "Rejecting outlet..."
    );
   const payload =
    action === "approve"
      ? {}
      : { rejectionReason: remarks };
    try{
        await privateApi.patch(`/outlets/${outlet?.id}/${action==="approve" ? "approval" : "reject"}`, payload
        );
      toast.success(
        action === "approve"
          ? "Outlet approved successfully."
          : "Outlet rejected successfully.",
        { id: toastId }
      );
          router.refresh(); // ✅ THIS IS THE KEY LINE

    }catch(err){
      toast.error(getErrorMessage(err) || "An error occurred.", { id: toastId });
      console.error("Approval action failed:", err);
    }finally{
      closeApprovalModal();
    }

  };

  // LOI task (header button)
  const loiTask = data?.stages
    ?.find((s) => s.stageName === "Documentation")
    ?.tasks?.find((t) => t.title === "Upload LOI");

  const openDocument = (title: string, url?: string) => {
    if (!url) return;
    setDocPreview({
      open: true,
      title,
      url,
    });
  };

  console.log(data?.outlet?.outletStatus)
  return (
    <div className="p-paddingX space-y-6">
      {/* Header */}
      <div className="bg-whiteBg rounded-primaryRadius shadow-custom p-6 flex justify-between items-center">
        <div>
          <h1 className="text-heading3 font-bold text-primary">
            {outlet?.name ?? "—"}
          </h1>
          <p className="text-bodySmall text-neutralText">
            Area: {outlet?.areaName ?? "—"} · Warehouse:{" "}
            {outlet?.warehouseName ?? "—"}
          </p>
        </div>

        {/* Action Buttons */}
       {data?.outlet?.outletStatus==="draft" ? <div className="flex items-center gap-4">
          {/* View LOI */}
          <motion.button
            disabled={!loiTask?.document?.fileUrl}
            onClick={() =>
              openDocument(
                "Letter of Intent (LOI)",
                loiTask?.document?.fileUrl
              )
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-white/70 backdrop-blur-md border border-info/30
              text-info font-medium text-sm
              shadow-[0_6px_20px_rgba(32,72,119,0.22)]
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye size={18} />
            <span>View LOI</span>
          </motion.button>

          {/* Approve */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-full bg-success text-primary
              text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            onClick={() => setAction("approve")}
          >
            Approve
          </motion.button>

          {/* Reject */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-full bg-error text-whiteBg
              text-sm font-semibold shadow-[0_8px_24px_rgba(114,20,38,0.35)]"
            onClick={() => setAction("reject")}
          >
            Reject
          </motion.button>
        </div>:<div>
  <span
    className={`
      inline-flex items-center
      px-4 py-1.5
      rounded-full
      text-xs font-semibold
      tracking-wide
      ${
        data?.outlet?.outletStatus === "approved"
          ? "bg-success text-primary border border-success/30"
          : "bg-error/15 text-error border border-error/30"
      }
    `}
  >
    {data?.outlet?.outletStatus === "approved" ? "Approved" : "Rejected"}
  </span>
</div>
}

      </div>

      {/* Project Info */}
      <div className="bg-secondarySurface rounded-primaryRadius p-6 shadow-inset grid grid-cols-3 gap-6">
        <InfoBlock label="Project Status" value={project?.status ?? "—"} />
        <InfoBlock
          label="Expected Opening"
          value={project?.expectedOpeningDate ? formatDateWithOrdinal(project.expectedOpeningDate) : "—"}
        />
      </div>

      {/* Progress Summary */}
      <div className="bg-whiteBg rounded-primaryRadius p-6 shadow-custom grid grid-cols-4 gap-6">
        <InfoBlock
          label="Completion"
          value={`${data?.completionPercentage ?? 0}%`}
        />
        <InfoBlock
          label="Completed Stages"
          value={data?.completedStagesCount ?? 0}
        />
        <InfoBlock
          label="Next Stage"
          value={data?.nextPendingStage ?? "—"}
        />
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.stageId}
            className="bg-whiteBg rounded-secondaryRadius p-5 shadow-custom"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-bodyLarge font-medium text-primary">
                {stage.stageName}
              </h3>
              <span className="text-caption text-neutralText">
                {stage.completedTasks}/{stage.totalTasks} ·{" "}
                {stage.completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-neutralBg rounded-full overflow-hidden">
              <div
                className="h-full bg-info transition-all"
                style={{ width: `${stage.completionPercentage}%` }}
              />
            </div>

            {/* Tasks */}
            <div className="mt-4 space-y-2">
              {stage.tasks.map((task: NsoTask) => {
                const canPreview =
                  task.status === "completed" &&
                  !!task.document?.fileUrl;

                return (
                  <div
                    key={task.id}
                    className="flex justify-between items-center text-bodySmall"
                  >
                    <span className="text-neutralText">
                      {task.title}
                    </span>

                    <div className="flex items-center gap-3">
                      {canPreview && (
                        <button
                          onClick={() =>
                            openDocument(task.title, task.document.fileUrl)
                          }
                          className="text-info hover:scale-110 transition"
                          title="View document"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <span
                        className={`px-2 py-1 rounded text-caption ${
                          task.status === "completed"
                            ? "bg-success text-primary"
                            : task.status === "pending"
                            ? "bg-warning text-primary"
                            : "bg-neutralBg text-neutralText"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        open={!!action}
        action={action as "approve" | "reject"}
        remarks={remarks}
        onChange={setRemarks}
        onClose={closeApprovalModal}
        onSubmit={handleSubmit}
      />

      {/* Document Preview Modal */}
      <DocumentViewerModal
        open={docPreview.open}
        title={docPreview.title ?? "Document"}
        documentUrl={docPreview.url ?? ""}
        onClose={() => setDocPreview({ open: false })}
      />
    </div>
  );
};

export default OutletDetailPage;

/* ----------------------------- */
/* Small reusable block component */
/* ----------------------------- */

function InfoBlock({
  label,
  value,
}: {
  label?: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-caption text-neutralText mb-1">
        {label ?? "—"}
      </p>
      <p className="text-bodyLarge text-primary font-medium">
        {value ?? "—"}
      </p>
    </div>
  );
}
