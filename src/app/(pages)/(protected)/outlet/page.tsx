export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { Suspense, use } from "react";
import MainPage from "./main-page";
import Wrapper from "@/app/components/wrapper";
import Loading from "@/app/components/loading";
import { formatDateWithOrdinal } from "@/app/libs/functions";
import { notFound } from "next/navigation";
import { ApiOutlet, ApiStage} from "@/app/libs/types";

// ----------------------
// 1. Fetch function
// ----------------------
async function getOnboardedOutlets() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_POINT}/nso/outlets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) notFound();

  return res.json();
}

// ----------------------
// 2. Component that calls `use()`
// ----------------------
function OnboardedOutletsWrapper() {
  const responseOnboardedOutlets = use(getOnboardedOutlets());
  

  if (!responseOnboardedOutlets) notFound();
console.log("Onboarded Outlets Response:", responseOnboardedOutlets);
  const mappedOutlets = responseOnboardedOutlets?.map((el: ApiOutlet) => ({
    id: el?.outletId,
    name: el?.outletName,
    expectedDate: el?.expectedDate ? formatDateWithOrdinal(el.expectedDate) : "",
    actualDate: el?.actualDate ? formatDateWithOrdinal(el.actualDate) : "",
    address : el?.address ?? "",
    completedStages: el?.stages
      ?.filter((s: ApiStage) => s.isCompleted)
      ?.map((stage: ApiStage) => ({
        id: stage.stageId,
        name: stage.stageName,
        completionPercentage: stage.completionPercentage ?? 0,
      })),

    pendingStages: el?.stages
      ?.filter((s: ApiStage) => !s.isCompleted)
      ?.map((stage: ApiStage) => ({
        id: stage.stageId,
        name: stage.stageName,
        completionPercentage: stage.completionPercentage ?? "",
      })),
  }));

  return <MainPage onboardedOutlets={mappedOutlets} />;
}

// ----------------------
// 3. Page Component with Suspense
// ----------------------
export default function Page() {
  return (
    <Wrapper>
      <Suspense fallback={<Loading />}>
        <OnboardedOutletsWrapper />
      </Suspense>
    </Wrapper>
  );
}
