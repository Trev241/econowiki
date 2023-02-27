import React, { useContext } from "react"
import Error from "../pages/Error"
import { AuthContext } from "./AuthProvider"

export default function AuthenticationGuard({ component }) {
  const { isAuthenticated } = useContext(AuthContext)
  const ProtectedComponent = component

  return isAuthenticated ? (
    <ProtectedComponent />
  ) : (
    <Error
      error={{
        heading: "Unauthorized Access",
        message: "You must be logged in to access this page."
      }}
    />
  )
}