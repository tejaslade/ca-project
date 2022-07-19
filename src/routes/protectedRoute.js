// import React from 'react'
// import {Redirect , Route} from 'react-router-dom'

// const protectedRoute = ({component: Component, ...restOfProps}) => {
// const isAuthenticated = localStorage.getItem('isAuthenticated')

//   return (
//     <div>protectedRoute</div>
//   )
// }

// export default protectedRoute

import useAuth from "hooks/useAuth";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
