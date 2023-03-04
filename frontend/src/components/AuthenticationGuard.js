import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export function Private({ component }) {
  const { user } = useContext(AuthContext);
  const ProtectedComponent = component;

  return user ? <ProtectedComponent /> : <Navigate to={"/login"} />;
}

export function Public({ component }) {
  const { user } = useContext(AuthContext);
  const PublicComponent = component;

  return !user ? <PublicComponent /> : <Navigate to={"/"} />;
}
