// ../components/progress-stage.tsx
"use client";
import {motion} from "framer-motion"
import React from "react";
import { StageStatus } from "@/app/libs/types";

const bubbleBg: Record<StageStatus, string> = {
  completed: "bg-primary",
  "in-progress": "bg-info",
  "not-started": "bg-white",
};

const bubbleBorder: Record<StageStatus, string> = {
  completed: "border-primary",
  "in-progress": "border-info",
  "not-started": "border-neutralBg",
};

const bubbleText: Record<StageStatus, string> = {
  completed: "text-white",
  "in-progress": "text-white",
  "not-started": "text-neutralText",
};

const statusLabelText: Record<StageStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
};

interface Props {
  label: string;
  status: StageStatus;
  index: number;
  onClick: () => void;
  isActive?: boolean;
}

export function ProgressStage({
  label,
  status,
  index,
  onClick,
  isActive,
}: Props) {
  return (
    <motion.button
      type="button"
      className="flex flex-col items-center cursor-pointer focus:outline-none"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.06 }}
    >
      <motion.div
        className={[
          "w-10 h-10 rounded-full border-2 flex items-center justify-center",
          bubbleBg[status],
          bubbleBorder[status],
          isActive ? "ring-2 ring-offset-2 ring-info shadow-custom" : "",
        ].join(" ")}
        layout
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        {/* Step number inside bubble for clearer flow */}
        <span className={`text-[11px] font-medium ${bubbleText[status]}`}>
          {index + 1}
        </span>
      </motion.div>

      {/* Stage name */}
      <span
        className={[
          "mt-1 text-caption text-center leading-tight",
          isActive ? "text-primary font-medium" : "text-neutralText",
        ].join(" ")}
      >
        {label}
      </span>

      {/* Explicit status text */}
      <span className="mt-0.5 text-[10px] uppercase tracking-wide text-neutralText">
        {statusLabelText[status]}
      </span>
    </motion.button>
  );
}
