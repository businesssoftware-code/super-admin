"use client";

import { useState } from "react";
import { Category, AddAssetFormData } from "@/app/libs/types";

interface Props {
  categories: Category[];
  onSave: (data: AddAssetFormData) => void;
  onClose: () => void;
}

export default function AddAssetModal({ categories, onSave, onClose }: Props) {
  const [form, setForm] = useState<AddAssetFormData>({
    name: "",
    url: "",
    categoryId: "",
    newCategoryName: "",
  });

  const handleSave = () => {
    if (!form.name) return;
    if (!form.categoryId && !form.newCategoryName) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="font-semibold text-lg">Add Asset</h2>

        <input
          placeholder="Asset name"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Product URL (optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />

        {/* Existing categories */}
        {categories.length > 0 && (
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            <option value="">Select existing category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* New category */}
        <input
          placeholder="Or create new category"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          onChange={(e) =>
            setForm({ ...form, newCategoryName: e.target.value })
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
