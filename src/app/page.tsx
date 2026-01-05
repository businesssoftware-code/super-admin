"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "./libs/store/auth";

export default function Home() {
  const router = useRouter();
  const { userAuthData } = useAuthStore();

  useEffect(() => {
    if (userAuthData?.accessToken) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [userAuthData, router]);

  return null; // nothing to render
}
