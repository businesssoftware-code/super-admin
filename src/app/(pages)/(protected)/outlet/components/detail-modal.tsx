"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export function DetailModal({
  open,
  title,
  description,
  onClose,
  children,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative bg-white rounded-xl shadow-lg border border-gray-200
              w-full max-w-[80vw]   /* allows wider modal */
              max-h-[80vh]       /* prevent overflow off screen */
              overflow-y-auto     /* scroll when content is big */
              px-6 py-5
            "
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-500 hover:text-primary transition"
            >
              <X size={20} strokeWidth={2} />
            </button>

            <h2 className="text-xl font-semibold text-primary mb-3 pr-6">
              {title}
            </h2>

            {description && (
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            )}

            {children && <div className="mt-4">{children}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
