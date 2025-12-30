// ../components/timeline.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";

interface Props {
  active: boolean;
  index: number;
}

export function TimelineLine({ active, index }: Props) {
  return (
    <motion.div
      className={`h-[3px] flex-1 rounded-full ${
        active ? "bg-primary" : "bg-neutralBg"
      }`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: active ? 1 : 0.3 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{ transformOrigin: "left" }}
    />
  );
}
