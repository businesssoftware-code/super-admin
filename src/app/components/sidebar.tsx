"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import useAuthStore from "../libs/store/auth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { menuItems } from "../libs/constant";
import TopLineCard from "./top-line-card";


const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  // const { updateUserAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (link?: string) => {
    if (!link) return false;
    if (link === "/") return pathname === "/";
    return pathname === link || pathname.startsWith(link + "/");
  };

  // const handleLogout = () => {
  //   updateUserAuth({
  //     accessToken: "",
  //     refreshToken: "",
  //     name: "",
  //     empId: "",
  //     userId: "",
  //   });
  //   router.push("/login");
  // };

  return (
    <TopLineCard
      width={expanded ? "w-[252px]" : "w-[138px]"}
      // minHeight="h-screen"
      topColor="bg-info"
      // 👇 this applies to TopLineCard's *content wrapper*; we use it to set min-h-0
      childrenPadding="min-h-0"
      className="transition-all duration-300 rounded-[40px] relative pb-4 flex flex-col"
    >
      {/* Header */}
      <div
        className={`flex ${
          expanded ? "flex-row-reverse justify-between" : "justify-center"
        } items-center shrink-0`}        // 👈 don't let header steal space
      >
        <h1 className="text-heading3 text-info h-[55px] m-auto font-[500] flex items-center">
          Menu
        </h1>

        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <hr className="h-px bg-[#CCCABC] border-none drop-shadow shrink-0" />

      {/* Menu Items */}
      <div className="min-h-0 flex-1 flex flex-col gap-1 overflow-y-auto mt-2">
        {menuItems.map((item, index) => {
          const active = isActive(item.link);
          const rowBase =
            "font-bold flex items-center gap-3 px-5 transition-all duration-300 rounded-lg";
          const rowLayout = expanded ? "justify-around w-full" : "justify-center";
          const rowActive = active ? "bg-secondary" : "";
          const labelClass = `text-bodyLarge w-[167px] font-[500] text-left ${
            active ? "text-primary" : "text-info"
          }`;
          const iconClass = active ? "text-primary" : "text-info";

          if (item.label === "Logout") {
            return (
              <div key={item.label} className="w-full">
                <button className={`${rowBase} ${rowLayout}`}>
                  {expanded && <h1 className={labelClass}>{item.label}</h1>}
                
                  {item.icon && <item.icon className={iconClass} />}
                </button>
                {index !== menuItems.length - 1 && (
                  <hr className="h-px bg-[#CCCABC] border-none drop-shadow" />
                )}
              </div>
            );
          }

          return (
            <div key={item.label} className="w-full">
              <Link
                href={item.link ?? "#"}
                className={`${rowBase} ${rowLayout} ${rowActive}`}
                aria-current={active ? "page" : undefined}
              >
                {expanded && <h1 className={labelClass}>{item.label}</h1>}
                
                {item.icon && <item.icon className={iconClass} />}
              </Link>

              {index !== menuItems.length - 1 && (
                <hr className="h-px bg-[#CCCABC] border-none drop-shadow" />
              )}
            </div>
          );
        })}
      </div>
    </TopLineCard>
  );
};

export default Sidebar;
