export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { Suspense, use } from "react";
import MainPage from "./main-page";
import Wrapper from "@/app/components/wrapper";
import Loading from "@/app/components/loading";
import { formatDateWithOrdinal } from "@/app/libs/functions";
import { notFound } from "next/navigation";
import { ApiOutlet } from "@/app/libs/types";

// ----------------------
// 1. Fetch function
// ----------------------
async function getOnboardedOutlets() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";

  console.log(accessToken, "accessTokenaccessToken");

  const [resOfOutlets, resOfDashboard] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_POINT}/nso/outlets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }),

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_POINT}/outlets/nso/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }),
  ]);
  if (!resOfOutlets.ok) notFound();

  

  const outlets = await resOfOutlets.json();
  const dashboard = await resOfDashboard.json();

  return [outlets, dashboard];
}

// ----------------------
// 2. Component that calls `use()`
// ----------------------
function OnboardedOutletsWrapper() {
  
  const [responseOnboardedOutlets, responseOfDashboard] = use(getOnboardedOutlets());

  if (!responseOnboardedOutlets || !responseOfDashboard) notFound();

  console.log("Onboarded Outlets Response:", responseOfDashboard, responseOnboardedOutlets?.length);


  const mappedOutlets = responseOnboardedOutlets?.map((el: ApiOutlet) => ({
   
    outletId: el?.outletId,
    outletName: el?.outletName,
    outletStatus: el?.outletStatus==="draft" ? "Pending": (el?.outletStatus==="approved" ? "Approved": "Rejected"),
    expectedDate: el?.expectedDate
      ? formatDateWithOrdinal(el.expectedDate)
      : "",
    actualDate: el?.actualDate ? formatDateWithOrdinal(el.actualDate) : "",
    address: el?.address ?? "",
    rentAmount: el?.rentAmount ?? 0,
    sdAmount: el?.sdAmount ?? 0,
    city: el?.city ?? "",
    status: el?.status ?? "",
    daysPendingForLOIApproval: el?.daysPendingForLOIApproval ?? 0,
    stageIndicators: el?.stageIndicators ?? [],
    overallProgress: el?.overallProgress ?? 0,
    approvedDate: el?.approvedDate ?? "",
    rejectedDate: el?.rejectedDate ?? "",
    LIODoc: el?.LOIDoc ?? "",
    rejectedReason: el?.rejectedReason ?? "",
    createdAt: el?.createdAt ?? "",
    areaManager: el?.areaManager ?? "",
    
  }));

  

  return <MainPage onboardedOutlets={mappedOutlets} dashboardData={responseOfDashboard} />;
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
