import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { TypeOfOptions2 } from "../libs/types";
import { X } from "lucide-react";
import HorizontalLine from "./horizontal-line";

type TypeOfPageProps = {
  placeholder: string;
  background: string;
  list: TypeOfOptions2[];
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  handleChange: (name: string, value: string, type: string) => void;
  name: string;
  value: string;
  type: string;
  lineColor: string;
  selectedBg: string;
  handleReset?: (name: string) => void;
  disable?: boolean;
};

const DynamicSelectField: React.FC<TypeOfPageProps> = ({
  placeholder,
  background,
  open,
  list,
  handleClose,
  handleOpen,
  handleChange,
  name,
  value,
  type,
  lineColor,
  selectedBg,
  handleReset,
  disable,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY - 15,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  // Filtered list based on search
  const filteredList = list.filter((el) =>
    el.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative w-[140px]`}>
      <div className={`w-[140px] rounded-[17px] z-[100]`} ref={buttonRef}>
        <button
          className={`flex items-center gap-[10px] w-full h-[33px] rounded-[16.5px] ${
            value ? selectedBg : background
          } drop-shadow-custom`}
          onClick={
            !disable
              ? open
                ? () => {
                    handleClose();
                    setSearchTerm("");
                  }
                : () => {
                    handleOpen();
                    setSearchTerm("");
                  }
              : () => {}
          }
          style={{
            display: open ? "none" : "flex",
          }}
        >
          <div
            className={`w-[88px] h-[33px] flex flex-col justify-center pl-[14px]`}
          >
            <h1
              className={`text-bodyRegular ${
                value ? "text-white" : "text-primary"
              } whitespace-nowrap`}
            >
              {value
                ? value?.length > 11
                  ? value.slice(0, 10) + "..."
                  : value
                : placeholder}
            </h1>
          </div>

          {value && handleReset ? (
            <X
              className="w-[18px] h-[18px] text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleReset?.(name);
              }}
            />
          ) : (
            <Image
              src="/images/down-arrow.svg"
              alt="down-arrow"
              height="24"
              width="24"
              className="w-[24px] h-[24px] object-cover"
            />
          )}
        </button>

        {!disable &&
          open &&
          typeof document !== "undefined" &&
          createPortal(
            <div style={menuStyles} className={`bg-neutralBg rounded-[16.5px]`}>
              {/* 🔍 Search Input */}
              <div
                className={`flex items-center gap-2 px-3 w-full h-[40px] rounded-t-[16.5px] ${background}`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white rounded-md outline-none w-full text-bodyRegular text-neutralText placeholder:text-gray-400"
                />

                {/* ❌ Close Button */}
                <button
                  onClick={() => {
                    handleClose();
                    setSearchTerm("");
                  }}
                  className="p-1 rounded-md hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
              </div>

              <HorizontalLine width="w-full" background={lineColor} />

              {/* Filtered Dropdown List */}
              <div
                className="overflow-y-scroll scrollbar-hide hide-scrollbar"
                style={{ maxHeight: "200px" }}
              >
                {filteredList.length > 0 ? (
                  filteredList.map((el, index: number) => (
                    <button
                      key={el?.id}
                      className="block cursor-pointer w-full hover:bg-gray-300"
                      onClick={() => {
                        handleChange(name, String(el?.value), type);
                        handleClose();
                        setSearchTerm("");
                      }}
                    >
                      <div className="pl-[17px] ">
                        <div className="w-[88px] min-h-[25px] flex items-center justify-center">
                          <h1 className="text-primary text-bodyRegular">
                            {el?.label}
                          </h1>
                        </div>
                      </div>
                      {index !== filteredList.length - 1 && (
                        <HorizontalLine width="w-full" background={lineColor} />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default DynamicSelectField;
