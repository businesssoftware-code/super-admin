"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,

  Folder,
  FolderOpen,
} from "lucide-react";
import { Category } from "@/app/libs/types";

interface CategoryItemProps {
  category: Category;
  index: number;
  onEditAsset: () => void;
  onDeleteAsset: (assetId: string) => void;
}

export function CategoryItem({
  category,
  index,
  onDeleteAsset,
}: CategoryItemProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* Category */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-left"
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {open ? <FolderOpen size={16} /> : <Folder size={16} />}
        <span className="font-semibold">
          {index + 1}. {category.name}
        </span>
      </button>

    
    </div>
  );
}

