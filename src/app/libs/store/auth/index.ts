import { create } from "zustand";
import { getCookies, setCookies } from "../../cookies";

type TypeOfUserAuth = {
  accessToken: string;
  refreshToken: string;
  name: string;
  empId: string;
  userId: string;
};

type AuthStore = {
  userAuthData: TypeOfUserAuth;
  updateUserAuth: (data: TypeOfUserAuth) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  userAuthData: {
    accessToken: getCookies("accessToken") ?? "",
    refreshToken: getCookies("refreshToken") ?? "",
    name: getCookies("name") ?? "",
    empId: getCookies("empId") ?? "",
    userId: getCookies("userId") ?? "",
  },
  updateUserAuth: (data:TypeOfUserAuth) => {

    set({ userAuthData: data });
    setCookies( data.accessToken, data.refreshToken, data?.name, data?.empId, data?.userId);

  },
}));

export default useAuthStore;
