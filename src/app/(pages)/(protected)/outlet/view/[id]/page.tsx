import Loading from "@/app/components/loading";
import { Suspense } from "react";
import { use } from "react";

import { cookies } from "next/headers";
import OutletDetailPage from "./main-page";
import Wrapper from "@/app/components/wrapper";
import { TypeOfOptions, Vendor } from "@/app/libs/types";

async function fetchVendors(
  accessToken: string
): Promise<TypeOfOptions[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_POINT}/vendors`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch vendors");
  }

  const vendors: Vendor[] = await res.json();

  // ✅ CONVERSION HAPPENS HERE
  return vendors.map((vendor) => ({
    id: vendor.id,
    label: vendor.name,
    value: vendor.id,
  }));
}




async function fetchNsoOutletById(id: string, accessToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_POINT}/nso/outlets/${id}`,
    { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
     cache: "no-store" 
  }
  );
console.log("Fetch outlet response:", res);
  if (!res.ok) throw new Error("Failed to fetch outlet");
  return res.json();
}

function OutletLoader({ id }: { id: string }) {
   const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? "";
 const data = use(
    Promise.all([
      fetchNsoOutletById(id, accessToken),
      fetchVendors(accessToken),
    ])
  );

  const [outlet, vendors] = data;  
  console.log("Outlet data:", vendors);
  return <OutletDetailPage data={outlet} vendors={vendors} />;
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading/>}>
      <Wrapper>
      <OutletLoader id={params.id} />
      </Wrapper>
    </Suspense>
  );
}
