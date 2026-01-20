"use client";

import { useState } from "react";
import { Category } from "@/app/libs/types";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Package,
  ExternalLink,
  Trash2,
  Folder,
} from "lucide-react";

interface Props {
  data: Category[];
  onDelete: (id: string) => void;
}

export default function AssetTree({ data, onDelete }: Props) {
  if (!data.length) {
    return (
      <p className="text-bodySmall text-neutralText text-center py-6">
        No assets added yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((category, index) => (
        <CategoryItem
          key={category.id}
          category={category}
          index={index}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/* ---------------- CATEGORY ITEM ---------------- */

function CategoryItem({
  category,
  index,
  onDelete,
}: {
  category: Category;
  index: number;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-secondaryRadius bg-secondarySurface border border-neutralBg">
      {/* Category Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-secondaryRadius hover:bg-secondary transition-colors"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-primary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary" />
        )}

        {!open ? <Folder className="h-4 w-4 text-primary" /> : <FolderOpen className="h-4 w-4 text-primary" />}

        <span className="font-medium text-bodyRegular text-primary">
          {index + 1}. {category.name}
        </span>

        <span className="ml-auto text-caption text-neutralText">
          {category.assets.length} assets
        </span>
      </button>

      {/* Assets */}
      {open && (
        <ol className="px-6 pb-4 space-y-2">
          {category.assets.length > 0 ? (
            category.assets.map((asset, assetIndex) => (
              <li
                key={asset.id}
                className="flex items-center gap-3 px-3 py-2 rounded-secondaryRadius bg-whiteBg hover:bg-accent transition group"
              >
                <Package className="h-4 w-4 text-info" />

                <span className="text-bodySmall text-primary">
                  {index + 1}.{assetIndex + 1} {asset.name}
                </span>

                {asset.url && (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <button
                  onClick={() => onDelete(asset.id)}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-error transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-bodySmall text-neutralText pl-6">
              No assets in this category
            </p>
          )}
        </ol>
      )}
    </div>
  );
}
