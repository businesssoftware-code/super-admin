import Loading from "@/app/components/loading";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Wrapper from "@/app/components/wrapper";
import MainPage from "./main-page";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    formType: string;
    type: string;
    traineeId: string;
  };
}

const AsyncChecklistPage = async ({ params }: PageProps) => {
  const {formType, type, traineeId} = params;
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value ?? "";
 

  try {
    const [trainingUsers, checklistRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_POINT}/training/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_POINT}/training/${formType==="checklist" ? "checklists" : "evaluations"}?trainingType=${type}&filledBy=superAdmin`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

    ])
    
   


    const checklistData = await checklistRes.json();
    const trainingUsersData = await trainingUsers.json();
    
    if (!checklistData || !trainingUsersData) {
      notFound();
    }

    console.log(checklistData, "trainingUsersData");


    return <MainPage traineeName={
      trainingUsersData?.find((trainee:{id:number, name:string;})=>trainee.id===Number(traineeId))
      ?


      trainingUsersData?.find((trainee:{id:number})=>trainee.id===Number(traineeId))?.name


      :
      ""

    } formType={formType} formData={checklistData} traineeId={traineeId}/>;

  } catch (err) {
    console.error("Error fetching checklist:", err);
    notFound();
  }
};

export default function Page({ params }: PageProps) {
  return (
    <Wrapper>
      <Suspense fallback={<Loading />}>
        <AsyncChecklistPage params={params} />
      </Suspense>
    </Wrapper>
  );
}
