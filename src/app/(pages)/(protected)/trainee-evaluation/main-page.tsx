"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, privateApi } from "@/app/libs/axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DynamicButton from "@/app/components/dynamic-button";
import { StaffTrainee, TypeOfOptions } from "@/app/libs/types";
import DropDown2 from "@/app/components/drop-down2";

type TypeOfTraineeEvaluationProps = {
  userData: StaffTrainee[];
  batches: TypeOfOptions[];
};

const TraineeEvaluation: React.FC<TypeOfTraineeEvaluationProps> = ({
  batches,
  userData,
}) => {


  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"L3">("L3");
  const [selectedBatch, setSelectedBatch] = useState<string>("");


  const [data, setData] = useState<StaffTrainee[]>(userData);
  const firstRun = useRef(true);


  // Format date to YYYY-MM-DD
  // const formatted =
  // String(today.getDate()).padStart(2, "0") +
  // "/" +
  // String(today.getMonth() + 1).padStart(2, "0") +
  // "/" +
  // today.getFullYear()



  const handleChange = (name: string, value: string) => {
    if (name === "batch") setSelectedBatch(value);


  };

  const fetchData = async () => {
    const toastId = toast.loading("Fetching the data...");

    try {
      const response = await privateApi.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_POINT
        }/training/users?${
          selectedBatch ? `&batchId=${selectedBatch}` : ""
        }&type=${activeTab}`
      );
      toast.success("Data fetched successfully!", { id: toastId });
      setData(response.data);
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err), { id: toastId });
    }
  };


  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    
  }, [selectedBatch, activeTab]);

  const handleRedirection = () => {
    router.push("/home");
  };

  return (
    <>
      <div className="flex items-center gap-[20px]">
        <Image
          src="/images/backward-icon.svg"
          alt="backward-icon"
          height="50"
          width="50"
          className="object-cover cursor-pointer"
          onClick={handleRedirection}
        />
        <div className="h-[66px] flex flex-col justify-center">
          <h1 className="text-heading3 text-primary whitespace-nowrap">
            Trainee Evaluation
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
        <div className="flex gap-4 items-center">
          <h1>Filters:</h1>

          {/* Batch Dropdown */}
          <DropDown2
            placeholder="Select Batch"
            list={batches}
            handleChange={handleChange}
            name="batch"
            value={
              batches.find((el) => String(el.value) === String(selectedBatch))
                ?.label || ""
            }
            handleReset={(name: string) => handleChange(name, "")}
            type="batch"
          />

        

        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mt-6 border-b pb-2">
        {["L3"].map((tab) => (
          <DynamicButton
            key={tab}
            isActive={activeTab === tab}
            onClick={() => {
              setActiveTab(tab as "L3");

              setSelectedBatch("");
            
            }}
            text={tab}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-info text-accent">
            <tr>
              <th className="border-b px-4 py-3 text-left">Trainee Name</th>
                            <th className="border-b px-4 py-3 text-left">Base Location</th>
              <th className="border-b px-4 py-3 text-left">ID</th>

              <th className="border-b px-4 py-3 text-left">Batch Name</th>
              <th className="border-b px-4 py-3 text-left">Training Level</th>
              <th className="border-b px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-neutral-500">
                  No trainees found.
                </td>
              </tr>
            ) : (
              data
                ?.filter((t) => t.trainingLevel === activeTab)
                ?.map((trainee) => (
                  <tr key={trainee.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border-b">{trainee?.name}</td>
                                        <td className="px-4 py-3 border-b">{trainee?.baseLocation?.name ?? ""}</td>
                    <td className="px-4 py-3 border-b">{trainee?.empId}</td>

                    <td className="px-4 py-3 border-b">
                      {trainee?.batch?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {trainee?.trainingLevel || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {trainee?.status === "pending" ? (
                        <Link
                          href={`/form/evaluation/${activeTab}/${trainee?.id}`}
                          className="px-3 py-1.5 bg-info text-white rounded-md text-xs"
                        >
                          Take Eval
                        </Link>
                      ) : (
                        <p
                          className={
                            trainee?.status === "passed"
                              ? "text-primary"
                              : trainee?.status === "failed"
                              ? "text-error"
                              : ""
                          }
                        >
                          {trainee?.status === "passed" ||
                          trainee?.status === "failed"
                            ? Number.isNaN(Number(trainee?.percentage))
                              ? ""
                              : trainee?.percentage + "%"
                            : ""}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TraineeEvaluation;
