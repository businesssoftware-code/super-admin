// ../components/status-legend.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";

const items = [
  {
    label: "Completed",
    color: "bg-primary",
    text: "Step fully done.",
  },
  {
    label: "In Progress",
    color: "bg-info",
    text: "Work currently ongoing.",
  },
  {
    label: "Not Started",
    color: "bg-white border border-neutralBg",
    text: "Step not started yet.",
  },
];

export function StatusLegend() {
  return (
    <motion.div
      className="p-5 rounded-primaryRadius border  bg-white space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
      }}
      exit={{ opacity: 0, y: 8 ,transition:{staggerChildren: 0.1}}}
    >
     

     <div className="flex items-center justify-between">
       {items.map((item) => (
        <motion.div
          key={item.label}
          className="flex  items-start gap-2"
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <div className={`mt-1 w-3 h-3 rounded-full ${item.color}`} />
          <div>
            <div className="text-bodySmall text-primary font-medium">
              {item.label}
            </div>
            <div className="text-caption text-neutralText">
              {item.text}
            </div>
          </div>
        </motion.div>
      ))}
     </div>
    </motion.div>
  );
}
