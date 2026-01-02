"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface DocumentViewerModalProps {
  open: boolean;
  title: string;
  documentUrl: string;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    transition: { duration: 0.15 },
  },
};

const DocumentViewerModal = ({
  open,
  title,
  documentUrl,
  onClose,
}: DocumentViewerModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-md flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="
              relative bg-white
              w-[90vw] max-w-[1100px]
              h-[85vh]
              rounded-2xl
              shadow-[0_30px_90px_rgba(0,0,0,0.35)]
              flex flex-col
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutralBg">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  {title}
                </h2>
                <p className="text-xs text-neutralText">
                  Document preview
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutralBg transition"
                  title="Open in new tab"
                >
                  <ExternalLink size={18} />
                </a>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutralBg transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#F7F7F7]">
              <iframe
                src={documentUrl}
                className="w-full h-full border-0"
                title={title}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewerModal;
