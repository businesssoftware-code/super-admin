"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useAuthStore from '../libs/store/auth';


type TypeOfPageProps = {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<TypeOfPageProps> = ({children}) => {

  const router = useRouter();
    const pathname = usePathname();
  const {userAuthData} = useAuthStore();


  const [isCheckingAuth, setIsCheckingAuth] = useState(true);


    useEffect(() => {  

       // allow login page
    if (pathname === "/login") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCheckingAuth(false);
      return;
    }

    if (!userAuthData?.accessToken) {
      router.push('/login');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCheckingAuth(false);
      return;
    }

    setIsCheckingAuth(false);
  }, [userAuthData?.accessToken, pathname, router]);

  if(isCheckingAuth)  return null;


  return (children);
}

export default PrivateRoute;
