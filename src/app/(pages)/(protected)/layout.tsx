

import PrivateRoute from '@/app/utills/private-route';
import React from 'react'

type TypeOfPageProps = {
    children: React.ReactNode;
}

const ProtectedLayout: React.FC<TypeOfPageProps> = ({children}) => {
  return (
    <PrivateRoute>
            {children}    
    </PrivateRoute>
  )
}

export default ProtectedLayout;
