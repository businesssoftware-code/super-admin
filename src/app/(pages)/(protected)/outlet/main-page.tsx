"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import Heading from "@/app/components/heading";
import OutletCard from "./components/outlet-card";
import { TypeOfOnboardedOutletsResponse } from "@/app/libs/types";

type TypeOfPageProps = {
  onboardedOutlets: TypeOfOnboardedOutletsResponse[];
};

type OutletStatusFilter = "all" | "draft" | "approved" | "rejected";

const Page: React.FC<TypeOfPageProps> = ({ onboardedOutlets }) => {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OutletStatusFilter>("all");

  const handleViewOutlet = (id: number) => {
    router.push(`/outlet/${id}`);
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredOutlets = onboardedOutlets.filter((outlet) => {
    const matchesSearch = `${outlet.name} ${outlet.address}`
      .toLowerCase()
      .includes(query);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : outlet.outletStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <Heading text="Outlets" />
      </div>

      {/* ================= SEARCH + FILTER ROW ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutralText">
            <Search size={16} />
          </span>

          <input
            type="search"
            name="outletSearch"
            placeholder="Search outlets by name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full rounded-xl border border-neutralBg bg-whiteBg
              py-3 pl-11 pr-4 text-sm text-primary
              placeholder:text-neutralText outline-none transition
              focus:border-info focus:ring-2 focus:ring-info/20
              hover:border-info
            "
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-neutralText">
            Filter by status:
          </span>

          {[
            { key: "all", label: "All" },
            { key: "draft", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map((item) => {
            const isActive = statusFilter === item.key;

            return (
              <button
                key={item.key}
                onClick={() =>
                  setStatusFilter(item.key as OutletStatusFilter)
                }
                className={`
                  px-4 py-1.5 rounded-full text-xs font-semibold
                  transition border
                  ${
                    isActive
                      ? "bg-info/15 text-info border-info/40"
                      : "bg-white text-neutralText border-neutralBg hover:border-info/40"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= OUTLET CARDS ================= */}
      {filteredOutlets.length === 0 ? (
        <div className="text-center text-neutralText mt-20">
          No outlets found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutlets.map((outlet) => (
            <OutletCard
              key={outlet.id}
              id={outlet.id}
              outletStatus={outlet.outletStatus}
              name={outlet.name}
              address={outlet.address}
              expectedDate={outlet.expectedDate}
              actualDate={outlet.actualDate}
              completedStages={outlet.completedStages ?? []}
              pendingStages={outlet.pendingStages ?? []}
              onClick={handleViewOutlet}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
