import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const PrivateRoute = ({ element, adminOnly, ...rest }) => {
  const { user } = useUserContext();

  // If the user is not logged in
  if (!user) {
    window.alert("To access all content of MCQ Town, please login");
    return <Navigate to="/Log&Reg" replace />;
  }

  // If the route is for admin-only pages
  if (adminOnly && user.login_type !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Render the element if user is logged in or if it's an admin-only page and user is an admin
  return element;
};

export default PrivateRoute;
