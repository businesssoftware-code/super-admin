"use client";

import { NsoOutletDetail, StageStatus, TypeOfOptions } from "@/app/libs/types";
import React, { useMemo, useState } from "react";
import { ProgressStage } from "../../components/progress-stage";
import { TimelineLine } from "../../components/timeline";
import { StatusLegend } from "../../components/status-legend";
import { Info } from "lucide-react";
import Gantt from "../../components/gantt";
import { getStatus } from "@/app/libs/functions";
import dayjs from "dayjs";
import SidePanel from "../../components/side-panel";

// ✅ ADDED IMPORTS
import PreviewBox from "../../components/preview-box";
import { DetailModal } from "../../components/detail-modal";
import DynamicSelectField from "@/app/components/dynamic-select-field";

interface OutletDetailPageProps {
  data: NsoOutletDetail;
  vendors: TypeOfOptions[];
}

const OutletDetailPage: React.FC<OutletDetailPageProps> = ({ data, vendors }) => {
  console.log(data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [showLegend, setShowLegend] = useState(false);

  // ✅ PREVIEW MODAL STATE
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null
  );
const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
const [vendorSubmitState, setVendorSubmitState] = useState<{
  isSubmitting: boolean;
  error: string | null;
}>({
  isSubmitting: false,
  error: null,
});



  const handlePreview = (url: string) => {
    setSelectedPreviewUrl(url);
    setOpenPreviewModal(true);
  };
const handleSubmitVendor = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedVendor) {
    setVendorSubmitState({
      isSubmitting: false,
      error: "Please select a vendor",
    });
    return;
  }

  try {
    setVendorSubmitState({ isSubmitting: true, error: null });

    // await assignVendor({ vendorId: selectedVendor });

  } catch (err) {
    setVendorSubmitState({
      isSubmitting: false,
      error: "Failed to submit vendor. Try again.",
    });
    return;
  }

  setVendorSubmitState({ isSubmitting: false, error: null });
};

  const handleVendorChange = (
  name: string,
  value: string | number | Array<string | number>,
  type: string
) => {
  setVendorSubmitState((s) => ({ ...s, error: null }));
    setSelectedVendor(Number(value));
  };
const selectedVendorLabel =
  vendors.find((v) => v.value === selectedVendor)?.label ?? "";



  const STAGE_ORDER = [
    "Onboarding",
    "Legal",
    "Documentation",
    "Design",
    "Fabrication",
    "Hiring & Training",
  ] as const;

  const stageMap = useMemo(() => {
    return new Map(
      (data?.stages ?? []).map((stage) => [stage.stageName, stage])
    );
  }, [data]);


  const stages = STAGE_ORDER.map((label) => {
    const backendStage = stageMap.get(label);
    const completion = backendStage?.completionPercentage ?? 0;

    return {
      label,
      completion,
      status: getStatus(completion) as StageStatus,
    };
  });

  const ganttTasks = data?.stages?.map((stage) => {
    const start = dayjs(stage?.startDate);
    const end = stage?.endDate ? dayjs(stage.endDate) : start;

    return {
      id: String(stage?.stageId),
      name: stage?.stageName ?? "Unnamed stage",
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
      progress: stage?.completionPercentage ?? 0,
      dependsOn: [],
    };
  });

  const earliestTaskDate = new Date(
    Math.min(...ganttTasks.map((t) => new Date(t.start).getTime()))
  );

  const selectedBackendStage = useMemo(() => {
    return data?.stages?.find(
      (stage) => stage.stageName === selectedStage
    );
  }, [data, selectedStage]);

  const sidePanelSteps = useMemo(() => {
  return (
    selectedBackendStage?.tasks?.map((task) => ({
      label: task.title,
      completed: task.status === "completed",
      date: task.actualDate
        ? dayjs(task.actualDate).format("DD MMM, YYYY")
        : undefined,

      // ✅ FILE LOGIC
      hasFile: Boolean(task.document?.fileUrl),

      // ✅ DEPENDENCIES
      isBlocked: task.dependencies?.isBlocked,
      dependencies: task.dependencies
        ? {
            pending: task.dependencies.pending.map((d) => ({
              title: d.title,
              department: d.department,
              isCompleted: d.isCompleted,
            })),
            satisfied: task.dependencies.satisfied.map((d) => ({
              title: d.title,
              department: d.department,
              isCompleted: d.isCompleted,
            })),
          }
        : undefined,

      // ✅ EYE CLICK → OPEN PREVIEW MODAL
      onViewClick: task.document?.fileUrl
        ? () => handlePreview(task.document!.fileUrl)
        : undefined,
    })) ?? []
  );
}, [selectedBackendStage]);


  const sidePanelStatus = selectedBackendStage
    ? getStatus(selectedBackendStage.completionPercentage)
    : "not-started";

  const sidePanelStartedDate = selectedBackendStage?.startDate
    ? dayjs(selectedBackendStage.startDate).format("DD MMM, YYYY")
    : "-";

  // ✅ LEGAL DOCUMENTS FILTER
  const legalPreviewTasks = useMemo(() => {
    if (selectedBackendStage?.stageName !== "Legal") return [];

    return (
      selectedBackendStage.tasks?.filter(
        (task) => task.document?.fileUrl
      ) ?? []
    );
  }, [selectedBackendStage]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* MAIN CARD */}
      <div className="rounded-primaryRadius bg-white w-full">
        {/* Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-heading4 text-neutralText">
              Outlet Progress
            </h2>
            <h1 className="text-heading2 text-primary mt-1 capitalize">
              {data?.outlet?.name ?? ""}
            </h1>
          </div>

          <button
            onMouseEnter={() => setShowLegend(!showLegend)}
            onMouseLeave={() => setShowLegend(!showLegend)}
            className="text-primary px-4 py-2 rounded-lg"
          >
            <Info size={24} />
          </button>
        </div>

        {showLegend && (
          <div className="mb-10">
            <StatusLegend />
          </div>
        )}

        {/* Progress Timeline */}
        <div className="flex items-center justify-between px-4 mb-14">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.label}>
              <ProgressStage
                label={stage.label}
                isActive={stage.label === selectedStage}
                status={stage.status}
                index={index}
                onClick={() => {
                  setSelectedStage(stage.label);
                  setIsModalOpen(true);
                }}
              />
              {index < stages.length - 1 && (
                <TimelineLine
                  index={index}
                  active={stage.status !== "not-started"}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Gantt */}
        <Gantt
          tasks={ganttTasks}
          startDate={earliestTaskDate.toISOString()}
          days={80}
        />
      </div>

      {/* ✅ PREVIEW MODAL */}
     <DetailModal
  open={openPreviewModal}
  onClose={() => setOpenPreviewModal(false)}
>
  <div className="w-full h-[80vh]">
    <embed
      src={selectedPreviewUrl ?? ""}
      type="application/pdf"
      className="w-full h-full"
    />

   
  </div>
</DetailModal>


      {/* SIDE PANEL */}
      <SidePanel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stepNumber={
          STAGE_ORDER.findIndex((s) => s === selectedStage) + 1
        }
        title={selectedStage}
        status={sidePanelStatus}
        startedDate={sidePanelStartedDate}
        steps={sidePanelSteps}
        description=""
      >
       {selectedStage === "Fabrication" && (
  <form className="mt-6 mb-6" onSubmit={handleSubmitVendor}>
    <DynamicSelectField
      placeholder="Select Vendor"
      background="bg-primary"
      openedDropDownColor="bg-secondary"
      textColor="text-secondary"
      width="w-full"
      list={vendors}
      name="vendor"
      type="vendor"
      value={selectedVendorLabel}
      handleChange={handleVendorChange}
    />

    {vendorSubmitState.error && (
      <p className="mt-2 text-sm text-error">
        {vendorSubmitState.error}
      </p>
    )}

    <button
      type="submit"
      disabled={!selectedVendor || vendorSubmitState.isSubmitting}
      className="
        mt-4 w-full rounded-lg px-4 py-2
        bg-info text-white font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {vendorSubmitState.isSubmitting ? "Submitting..." : "Submit Vendor"}
    </button>
  </form>
)}


        {/* ✅ LEGAL DOCUMENT PREVIEW BOXES */}
        {selectedStage === "Legal" && legalPreviewTasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-6">
            {legalPreviewTasks.map((task) => (
              <PreviewBox
                key={task.id}
                title={task.title}
                previewUrl={task.document!.fileUrl}
                onView={() =>
                  handlePreview(task.document!.fileUrl)
                }
              />
            ))}
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default OutletDetailPage;
