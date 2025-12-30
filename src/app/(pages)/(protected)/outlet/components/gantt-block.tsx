// components/gantt-block.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export function GanttBlock({ text }: { text: string }) {
  return (
    <motion.div layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          className="rounded-secondaryRadius bg-secondarySurface border px-6 py-5 shadow-sm"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-medium text-heading4 text-primary mb-2">
            Detailed
          </h3>
          <p className="text-bodyRegular text-neutralText whitespace-pre-line">
            {text}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
