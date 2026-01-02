// src/app/(pages)/(protected)/outlet/[id]/page.tsx

import { cookies } from "next/headers";
import Wrapper from "@/app/components/wrapper";
import OutletDetailPage from "./main-page";
import Loading from "@/app/components/loading";
import { Suspense } from "react";

// ----------------------
// Fetch outlet by ID
// ----------------------
async function fetchNsoOutletById(id: string, accessToken: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_POINT}/nso/outlets/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error("API ERROR:", {
        url: res.url,
        status: res.status,
        body: errorMessage,
      });

      throw new Error(`Failed to fetch outlet (status ${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("fetchNsoOutletById failed:", error);
    throw error;
  }
}

// ----------------------
// Page Component
// ----------------------
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // ✅ unwrap params (required in Next.js App Router)
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";

  const outlet = await fetchNsoOutletById(id, accessToken);

  return (
    <Wrapper>
      <Suspense fallback={<Loading />}>
        <OutletDetailPage data={outlet} />
      </Suspense>
    </Wrapper>
  );
}
