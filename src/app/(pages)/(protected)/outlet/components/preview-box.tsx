"use client";

import React from "react";

type PreviewBoxProps = {
  title: string;
  previewUrl: string;
  onView: () => void;
};

const PreviewBox: React.FC<PreviewBoxProps> = ({
  title,
  previewUrl,
  onView,
}) => {
  return (
    <div className="flex flex-col justify-between w-full bg-[#F2F2F2] rounded-xl p-4">
      {/* Title */}
      <p className="text-caption text-info font-medium mb-2">
        {title}
      </p>

      {/* Preview */}
      <div className="relative w-full h-[140px] rounded-lg overflow-hidden bg-white">
        {/* PDF FIRST */}
        <embed
          src={previewUrl}
          type="application/pdf"
          className="w-full h-full"
        />

        {/* IMAGE FALLBACK */}
       

        {/* VIEW OVERLAY */}
        <button
          onClick={onView}
          className="
            absolute inset-0 m-auto
            h-fit w-fit px-4 py-1
            text-caption font-medium
            bg-black/60 text-white
            rounded-full
          "
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PreviewBox;
