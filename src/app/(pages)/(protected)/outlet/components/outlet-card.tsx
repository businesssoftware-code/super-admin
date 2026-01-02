"use client";

import { TypeOfStagesInOnboardedOutletsResponse } from "@/app/libs/types";
import { ArrowRight } from "lucide-react";

interface OutletCardProps {
  id: number;
  name: string;
  isDraft: boolean;
  expectedDate: string;
  address: string;
  actualDate?: string | null;
  completedStages: TypeOfStagesInOnboardedOutletsResponse[];
  pendingStages: TypeOfStagesInOnboardedOutletsResponse[];
  onClick: (id: number) => void;
}

const OutletCard: React.FC<OutletCardProps> = ({
  id,
  name,
  isDraft,
  expectedDate,
  actualDate,
  address,
  completedStages,
  pendingStages,
  onClick,
}) => {
  const isApproved = true;

  return (
    <div
      onClick={() => onClick(id)}
      className={`
        cursor-pointer rounded-xl border p-5
        flex flex-col gap-4 transition
        ${
          isApproved
            ? "border-success bg-white shadow-sm hover:shadow-md"
            : "border-warning bg-warning/10 shadow-sm hover:shadow-md"
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary">{name}</h3>

          <p className="text-caption font-extrabold text-neutralText">
            <span className="text-black">Address:</span> {address}
          </p>

          <p className="text-caption text-gray-500">
            Expected: {expectedDate}
          </p>

          <p className="text-caption text-gray-500">
            Actual: {actualDate ?? "N/A"}
          </p>
        </div>

        {/* Status + Arrow */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full text-nowrap ${
              isApproved
                ? "bg-success text-primary"
                : "bg-warning text-neutralText"
            }`}
          >
            {isApproved ? "Approved" : "Pending Approval"}
          </span>

          <ArrowRight className="text-gray-400" />
        </div>
      </div>

      {/* Completed */}
      {completedStages.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">
            Completed
          </p>
          <div className="flex flex-wrap gap-2">
            {completedStages.map((stage) => (
              <span
                key={stage.id}
                className="px-3 py-1 text-xs rounded-full bg-primary text-secondary"
              >
                {stage.name} · {stage.completionPercentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending / In progress */}
      {pendingStages.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">
            Pending / In Progress
          </p>
          <div className="flex flex-wrap gap-2">
            {pendingStages.map((stage) => (
              <span
                key={stage.id}
                className="px-3 py-1 text-xs rounded-full bg-warning text-neutralText"
              >
                {stage.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletCard;
