"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";

type ActionType = "approve" | "reject";

interface ApprovalModalProps {
  open: boolean;
  action: ActionType;
  remarks: string;
  onChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal:Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 20,
    transition: { duration: 0.15 },
  },
};

const ApprovalModal = ({
  open,
  action,
  remarks,
  onChange,
  onClose,
  onSubmit,
}: ApprovalModalProps) => {
  const isApprove = action === "approve";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-md"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-[460px]
              rounded-[22px]
              bg-whiteBg
              p-7
              shadow-[0_30px_80px_rgba(0,0,0,0.35)]
            "
          >
            {/* Accent Glow */}
            <div
              className={`absolute inset-x-0 -top-24 h-32 blur-3xl opacity-40 ${
                isApprove ? "bg-success" : "bg-error"
              }`}
            />

            {/* Header */}
            <div className="relative mb-5">
              <h2 className="text-heading3 font-semibold text-primary">
                {isApprove ? "Approve Outlet" : "Reject Outlet"}
              </h2>
              <p className="text-bodySmall text-neutralText mt-1">
                {isApprove
                  ? "Confirm approval of this outlet"
                  : "Please provide a reason for rejection"}
              </p>

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-0 right-0 text-neutralText hover:text-primary transition"
              >
                ✕
              </button>
            </div>

            {/* Textarea */}
            {!isApprove &&<div className="relative">
              <textarea
                value={remarks}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add remarks here..."
                className="
                  w-full h-32 resize-none
                  rounded-xl
                  border border-neutralBg
                  bg-white
                  p-4
                  text-bodySmall
                  focus:outline-none
                  focus:ring-2 focus:ring-info
                "
              />
              <span className="absolute bottom-3 right-4 text-caption text-neutralText">
                {remarks.length}/250
              </span>
            </div>}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="
                  px-5 py-2.5
                  rounded-xl
                  bg-neutralBg
                  text-neutralText
                  hover:bg-neutralBg/80
                  transition
                "
              >
                Cancel
              </button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!isApprove && !remarks.trim()}
                onClick={onSubmit}
                className={`
                  px-6 py-2.5
                  rounded-xl
                  font-medium
                  transition
                  disabled:opacity-50
                  ${
                    isApprove
                      ? "bg-success text-primary shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                      : "bg-error text-whiteBg shadow-[0_10px_30px_rgba(114,20,38,0.45)]"
                  }
                `}
              >
                {isApprove ? "Approve" : "Reject"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApprovalModal;
