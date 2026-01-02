"use client"
import { NsoOutletDetail } from "@/app/libs/types";
import { useState } from "react";
import ApprovalModal from "../components/approval-modal";

interface OutletDetailPageProps {
  data?: NsoOutletDetail;
}

const OutletDetailPage = ({ data }: OutletDetailPageProps) => {
  console.log("OutletDetailPage data:", data);
  const outlet = data?.outlet;
  const project = data?.project;
  const stages = data?.stages ?? [];
  const [action, setAction] = useState<'approve'|'reject'|null>(null);
  const [remarks, setRemarks] = useState("");
  const closeModal = () => {
    setAction(null);
    setRemarks("");
  };

  const handleSubmit = () => {
    console.log({
      action,
      remarks,
      outletId: outlet?.id,
    });

    closeModal();
  };

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
        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded-secondaryRadius bg-success text-primary text-btnAction shadow-custom"
            onClick={() => setAction("approve")}
          >
            Approve
          </button>
          <button
            className="px-6 py-2 rounded-secondaryRadius bg-error text-whiteBg text-btnAction shadow-custom"
            onClick={() => setAction("reject")}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-secondarySurface rounded-primaryRadius p-6 shadow-inset grid grid-cols-3 gap-6">
        <InfoBlock label="Project Status" value={project?.status ?? "—"} />
        <InfoBlock
          label="Expected Opening"
          value={project?.expectedOpeningDate ?? "—"}
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
            key={stage?.stageId}
            className="bg-whiteBg rounded-secondaryRadius p-5 shadow-custom"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-bodyLarge font-medium text-primary">
                {stage?.stageName ?? "—"}
              </h3>
              <span className="text-caption text-neutralText">
                {stage?.completedTasks ?? 0}/{stage?.totalTasks ?? 0} tasks ·{" "}
                {stage?.completionPercentage ?? 0}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-neutralBg rounded-full overflow-hidden">
              <div
                className="h-full bg-info transition-all"
                style={{
                  width: `${stage?.completionPercentage ?? 0}%`,
                }}
              />
            </div>

            {/* Tasks */}
            <div className="mt-4 space-y-2">
              {stage?.tasks?.map((task) => (
                <div
                  key={task?.id}
                  className="flex justify-between items-center text-bodySmall"
                >
                  <span className="text-neutralText">
                    {task?.title ?? "—"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-caption ${
                      task?.status === "completed"
                        ? "bg-success text-primary"
                        : task?.status === "pending"
                        ? "bg-warning text-primary"
                        : "bg-neutralBg text-neutralText"
                    }`}
                  >
                    {task?.status ?? "unknown"}
                  </span>
                </div>
              )) ?? null}
            </div>
          </div>
        ))}
      </div>
        <ApprovalModal
        open={!!action}
        action={action as "approve" | "reject"}
        remarks={remarks}
        onChange={setRemarks}
        onClose={closeModal}
        onSubmit={handleSubmit}
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
