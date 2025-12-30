"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { privateApi } from "../libs/axios";
import { useRouter } from "next/navigation";
import useAuthStore from "../libs/store/auth";


const LoginComponent = () => {


  const [authDetails, setAuthDetails] = useState<{
    emailOrId: string;
    password: string;
    otp: string;
  }>({
    emailOrId: "",
    password: "",
    otp: "",
  });

  const router = useRouter();
  const { updateUserAuth } = useAuthStore();




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {

      // Validate emailOrId and password
      if (!authDetails.emailOrId || !authDetails.password) {
        toast.error("Please fill the fields");
        return;
      }

      const toastId = toast.loading("Verifying...");

      try {
        const response = await privateApi.post("/hrms/auth/login", {
          email: authDetails.emailOrId,
          password: authDetails.password,
        });
      
        if (response.status === 201) {
          updateUserAuth({

            accessToken: response?.data?.accessToken,
            refreshToken: response?.data?.refreshToken,
            name: response?.data?.name,
            empId: response?.data?.empId,
            userId: (response?.data?.id) ? String(response?.data?.id) : "",

          });

          toast.success("Login Successful!", { id: toastId });

          router.push("/home");
       
        } else {
          toast.error("Something went wrong!", {
            id: toastId,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong!", {
          id: toastId,
        });
      } finally {
        toast.dismiss(toastId);
      }
 
  };

  return (
    <div className="flex flex-col items-center w-[716px] h-auto px-10 py-4 gap-6 z-10 mt-[-100px]">
      <h1 className="text-heading2 font-bold text-primary pb-2 w-full text-center">
        SUPER ADMIN PORTAL
      </h1>

    
        <div className="w-full flex flex-col gap-6">
          <h2 className="text-heading4 font-semibold text-primary">
            SUPER Admin Login:
          </h2>

          <div className="flex flex-col gap-2">
            <p className="text-bodyRegular text-primary">
              Enter Email ID or Employee ID{" "}
              <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              name="emailOrId"
              onChange={handleChange}
              value={authDetails.emailOrId}
              placeholder="abc@gmail.com or BAS-123"
              className="w-full h-[45px] px-4 rounded-full border border-neutralText shadow-inner outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-bodyRegular text-primary">
              Enter Password <span className="text-red-500">*</span>{" "}
            </p>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={authDetails.password}
              placeholder="********"
              className="w-full h-[45px] px-4 rounded-full border border-neutralText shadow-inner outline-none"
            />
          </div>

          <button
            className="w-[150px] h-[40px] bg-primary text-secondary rounded-full mx-auto mt-2 hover:opacity-90 transition"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      

    
    </div>
  );
};

export default LoginComponent;
