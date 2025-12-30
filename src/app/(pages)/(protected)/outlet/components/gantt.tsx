"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

export type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  details?: string;
  dependsOn?: string[];
};

type GanttProps = {
  tasks: Task[];
  startDate: string;
  days?: number;
};

export default function Gantt({ tasks, startDate, days = 30 }: GanttProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [hover, setHover] = useState<{
    task: Task | null;
    x: number;
    y: number;
  } | null>(null);

  const [containerWidth, setContainerWidth] = useState(1000);

  const MIN_VISIBLE_DAYS = 30;
  const MIN_DAY_WIDTH = 24;

  const computedDayWidth = containerWidth / MIN_VISIBLE_DAYS;
  const dayWidth = Math.max(computedDayWidth, MIN_DAY_WIDTH);
  const totalWidth = dayWidth * days;

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const updateWidth = () =>
      setContainerWidth(wrapperRef.current!.offsetWidth);

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const chartStart = new Date(startDate);

  const dateToPx = (date: string) => {
    const diff =
      (new Date(date).getTime() - chartStart.getTime()) / 86400000;

    return diff * dayWidth;
  };

  const durationToPx = (s: string, e: string) => {
    const diff =
      (new Date(e).getTime() - new Date(s).getTime()) / 86400000;

    return diff * dayWidth;
  };

  // ----------------------------------------
  // MONTH HEADER CALCULATION
  // ----------------------------------------
  const months: { name: string; span: number }[] = [];
  let i = 0;

  while (i < days) {
    const date = new Date(chartStart.getTime() + i * 86400000);
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    let span = 1;
    while (
      i + span < days &&
      new Date(chartStart.getTime() + (i + span) * 86400000).getMonth() ===
        date.getMonth()
    ) {
      span++;
    }
    months.push({ name: label, span });
    i += span;
  }

  // ----------------------------------------
  // DEPENDENCY ARROWS (L-SHAPED + CENTERED)
  // ----------------------------------------
  const ROW_HEIGHT = 48;
  const TASK_TOP = 2;
  const TASK_HEIGHT = 32;

  const getTaskCenterY = (index: number) =>
    index * ROW_HEIGHT + TASK_TOP + TASK_HEIGHT / 2;

  const getTaskPos = (t: Task) => {
    const left = dateToPx(t.start);
    const width = durationToPx(t.start, t.end);
    return { xStart: left, xEnd: left + width };
  };

  const dependencyArrows: { d: string }[] = [];

  tasks.forEach((task, targetIndex) => {
    if (!task.dependsOn) return;

    task.dependsOn.forEach((depId) => {
      const sourceIndex = tasks.findIndex((t) => t.id === depId);
      if (sourceIndex === -1) return;

      const src = getTaskPos(tasks[sourceIndex]);
      const trg = getTaskPos(task);

      const startX = src.xEnd;
      const endX = trg.xStart;

      const startY = getTaskCenterY(sourceIndex);
      const endY = getTaskCenterY(targetIndex);

      const midX = startX + 20;

      const path = `
        M ${startX} ${startY}
        L ${midX} ${startY}
        L ${midX} ${endY}
        L ${endX} ${endY}
      `;

      dependencyArrows.push({ d: path });
    });
  });

  return (
    // ⭐ FIXED HEIGHT FOR FULL CHART
    <div className="relative w-full" ref={wrapperRef}>
      {/* TOOLTIP */}
      {hover && hover.task && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 bg-black text-white text-xs px-3 py-2 rounded shadow-lg pointer-events-none"
          style={{
            left: hover.x + 12,
            top: hover.y - 40,
          }}
        >
          <div className="font-semibold">{hover.task.name}</div>
          <div className="whitespace-pre-line">{hover.task.details}</div>
          <div className="text-gray-300">Progress: {hover.task.progress}%</div>
        </motion.div>
      )}

      <div className="border rounded-lg overflow-hidden shadow bg-white h-full">
        {/* ⭐ This now fills chart height */}
        <div className="overflow-x-auto h-full">
          <div style={{ width: totalWidth }}>
            {/* MONTH HEADER */}
            <div className="flex h-10 border-b bg-gray-200 text-gray-700 font-semibold">
              {months.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center border-r last:border-none"
                  style={{ width: m.span * dayWidth }}
                >
                  {m.name}
                </div>
              ))}
            </div>

            {/* DAY HEADER */}
            <div className="flex h-12 border-b bg-gray-100 text-gray-600 text-xs">
              {Array.from({ length: days }).map((_, i) => {
                const day = new Date(chartStart.getTime() + i * 86400000);

                const isMonthStart =
                  i > 0 &&
                  new Date(chartStart.getTime() + i * 86400000).getMonth() !==
                    new Date(
                      chartStart.getTime() + (i - 1) * 86400000
                    ).getMonth();

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center border-r last:border-none relative"
                    style={{ width: dayWidth }}
                  >
                    {isMonthStart && (
                      <div
                        className="absolute left-0 top-0 h-full bg-gray-700"
                        style={{ width: 2 }}
                      />
                    )}
                    <span className="font-medium">{day.getDate()}</span>
                    <span className="text-[10px] text-gray-500">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* GRID + TASKS + ARROWS */}
            <div className="relative h-full">

              {/* ⭐ GRID LINES NOW FILL FULL HEIGHT */}
              <div
                className="absolute left-0 top-0 pointer-events-none z-10"
                style={{
                  width: totalWidth,
                  height: "100%",     // 🔥 FIX: grid covers entire chart vertically
                  display: "flex",
                }}
              >
                {Array.from({ length: days }).map((_, i) => {
                  const current = new Date(chartStart.getTime() + i * 86400000);
                  const prev = new Date(
                    chartStart.getTime() + (i - 1) * 86400000
                  );

                  const isMonthStart =
                    i > 0 && current.getMonth() !== prev.getMonth();

                  return (
                    <div
                      key={i}
                      style={{ width: dayWidth, position: "relative" }}
                    >
                      <div className="border-r border-gray-300 h-full w-full" />

                      {isMonthStart && (
                        <div
                          className="absolute left-0 top-0 h-full bg-gray-700"
                          style={{ width: 2 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ARROWS */}
              <svg
                className="absolute top-0 left-0 pointer-events-none z-30"
                width={totalWidth}
                height={tasks.length * ROW_HEIGHT}
                style={{ overflow: "visible" }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 5, 0 10" fill="#204877" />
                  </marker>
                </defs>

                {dependencyArrows.map((arrow, idx) => (
                  <path
                    key={idx}
                    d={arrow.d}
                    stroke="#204877"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                ))}
              </svg>

              {/* TASK ROWS */}
              {tasks.map((t, index) => {
                const left = dateToPx(t.start);
                const width = durationToPx(t.start, t.end);
                const progressWidth = (t.progress / 100) * width;

                return (
                  <div key={t.id} className="h-12 border-b relative bg-white">
                    <motion.div
                      className="absolute top-2 h-8 rounded-md overflow-hidden cursor-pointer z-20"
                      initial={{ opacity: 0, x: left }}
                      animate={{ opacity: 1, x: left }}
                      style={{
                        width,
                        background: "#848484",
                      }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={(e) => {
                        const rect =
                          wrapperRef.current!.getBoundingClientRect();
                        setHover({
                          task: t,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }}
                      onMouseMove={(e) => {
                        const rect =
                          wrapperRef.current!.getBoundingClientRect();
                        setHover({
                          task: t,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: progressWidth,
                          background: "#063312",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-secondary">
                        {t.name}
                      </div>
                    </motion.div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
