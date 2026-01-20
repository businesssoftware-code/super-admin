"use client";

import { useState } from "react";
import Wrapper from "@/app/components/wrapper";
import AssetStats from "./components/asset-stats";
import AssetTree from "./components/asset-tree";
import AddAssetModal from "./components/add-asset-modal";
import { Category, AddAssetFormData } from "@/app/libs/types";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  const addAsset = (data: AddAssetFormData) => {
    setCategories((prev) => {
      const updated = [...prev];

      let category: Category | undefined;

      if (data.categoryId) {
        category = updated.find((c) => c.id === data.categoryId);
      }

      if (!category && data.newCategoryName) {
        category = {
          id: crypto.randomUUID(),
          name: data.newCategoryName,
          assets: [],
        };
        updated.push(category);
      }

      if (!category) return updated;

      category.assets.push({
        id: crypto.randomUUID(),
        name: data.name,
        url: data.url,
      });

      return updated;
    });

    setOpen(false);
  };

  const deleteAsset = (id: string) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        assets: category.assets.filter((a) => a.id !== id),
      }))
    );
  };

  const totalAssets = categories.reduce(
    (sum, c) => sum + c.assets.length,
    0
  );

  return (
    <Wrapper>
      <div className="p-6 bg-gray-50 min-h-screen space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-semibold">Asset Management</h1>
            <p className="text-sm text-gray-500">
              Centralized assets for all outlets
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            + Add Asset
          </button>
        </div>

        <AssetStats
          totalAssets={totalAssets}
          categories={categories.length}
        />

        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Asset Hierarchy</h2>
          <AssetTree data={categories} onDelete={deleteAsset} />
        </div>

        {open && (
          <AddAssetModal
            categories={categories}
            onSave={addAsset}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </Wrapper>
  );
}
