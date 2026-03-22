import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const StudentPri = ({ children }) => {
  const token = Cookies.get("token");

  if (!token) {
    return <>
     
    <Navigate to="/StudentLogin"/>
    </>
  }

  return children;
};

export default StudentPri