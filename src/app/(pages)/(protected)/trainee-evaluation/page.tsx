import Loading from "@/app/components/loading";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import TraineeEvaluation from "./main-page";
import Wrapper from "@/app/components/wrapper";

const AsyncUserPage = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value || "";


  try {
    const [userRes, batchRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_POINT}/training/users?type=L3`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      ),

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_POINT}/training/batches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok  || !batchRes.ok) {
      notFound();
    }

    const userData = await userRes.json();
    const batches = await batchRes.json();

  

    const batchesData = batches.map((batch:{name: string, id: number})=>{
      return {label: batch.name, value: batch.id}
    })
 
    // eslint-disable-next-line react-hooks/error-boundaries
    return <TraineeEvaluation  batches={batchesData} userData={userData} />;
    
  } catch (err) {
    console.error("Error fetching data:", err);
    notFound();
  }
};

export default function Page() {
  return (
    <Wrapper>
    <Suspense fallback={<Loading />}>
      <AsyncUserPage />
    </Suspense>
    </Wrapper>
  );
}
