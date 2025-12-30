"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

/* ================= TYPES ================= */

export interface StepDependency {
  title: string;
  department: string;
  isCompleted: boolean;
}

export interface Step {
  label: string;
  completed: boolean;
  date?: string;

  isBlocked?: boolean;
  dependencies?: {
    pending: StepDependency[];
    satisfied: StepDependency[];
  };

  hasFile?: boolean;
  fileUrl?: string;
  onViewClick?: () => void;
}

export interface SidePanelProps {
  isOpen: boolean;
  onClose?: () => void;
  stepNumber: number;
  title: string;
  status: string;
  description: string;
  startedDate: string;
  steps: Step[];
  notes?: string[];
  children?: React.ReactNode;
}

/* ================= COMPONENT ================= */

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  stepNumber,
  title,
  status,
  description,
  startedDate,
  steps,
  notes = [],
  children,
}) => {
  const completedSteps = steps.filter((s) => s.completed).length;

  const STATUS_COLOR_MAP: Record<string, string> = {
    completed: "bg-green-500",
    "in-progress": "bg-blue-500",
    "not-started": "bg-gray-400",
  };

  const resolvedStatusColor =
    STATUS_COLOR_MAP[status] ?? "bg-gray-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ================= OVERLAY ================= */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ================= PANEL ================= */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-xl z-50 rounded-l-xl overflow-y-auto p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-full text-sm font-semibold">
                  {stepNumber}
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* ================= STATUS ================= */}
            <div
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-md text-white ${resolvedStatusColor}`}
            >
              {status}
            </div>

            <p className="mt-4 text-gray-700 text-sm">{description}</p>

            <div className="mt-4 text-sm text-gray-600">
              Started: {startedDate}
            </div>

            <hr className="my-4" />

            {/* ================= SUBSTEPS ================= */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Substeps</h3>
                <span className="text-sm text-gray-600">
                  {completedSteps}/{steps.length} completed
                </span>
              </div>

              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(completedSteps / steps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((step, i) => {
                  const isBlocked =
                    step.isBlocked && !step.completed;

                  return (
                    <div
                      key={i}
                      className={`p-3 border rounded-lg ${
                        step.completed
                          ? "bg-green-50 border-green-300"
                          : isBlocked
                          ? "bg-gray-100 border-gray-300 opacity-70"
                          : "bg-gray-50"
                      }`}
                    >
                      {/* ===== ROW ===== */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : isBlocked
                              ? "bg-gray-300 text-gray-600"
                              : "border text-gray-600"
                          }`}
                        >
                          {step.completed
                            ? "✓"
                            : isBlocked
                            ? "🔒"
                            : i + 1}
                        </div>

                        <span className="font-medium flex-1">
                          {step.label}
                        </span>

                      
{/* ===== EYE (ONLY IF FILE EXISTS) ===== */}
{step.hasFile && (
  <button
    onClick={step.onViewClick}
    className="p-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
    title="View document"
  >
    <Eye size={14} />
  </button>
)}


                      </div>

                      {/* ===== DATE ===== */}
                      {step.completed && step.date && (
                        <div className="ml-8 mt-1 text-xs text-gray-600">
                          Completed {step.date}
                        </div>
                      )}

                      {/* ===== DEPENDENCY SHOWN IF FILE MISSING ===== */}
                     {!step.hasFile && (
  <div className="ml-8 mt-2">
    {step.dependencies?.pending?.length ? (
      <>
        <p className="text-xs text-gray-600 mb-1">
          Document pending due to:
        </p>
        <div className="flex flex-wrap gap-2">
          {step.dependencies.pending.map((dep, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800"
            >
              {dep.title} ({dep.department})
            </span>
          ))}
        </div>
      </>
    ) : (
      <p className="text-xs text-gray-500 italic">
        No dependency for this task
      </p>
    )}
  </div>
)}

                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="my-6" />

            {/* ================= NOTES ================= */}
            {notes.length > 0 && (
              <div>
                <h3 className="font-medium">Notes</h3>
                <ul className="mt-2 list-disc ml-5 text-sm text-gray-700">
                  {notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= FOOTER SLOT ================= */}
            <div className="mt-8">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
