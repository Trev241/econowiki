import { createContext, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService"

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [isAuthenticated, setAuthenticated] = useState(false)

  const navigate = useNavigate()

  const login = useCallback(async (username, password) => {
    const user = await authService.login(username, password)

    // Access token valid
    if (user?.access_token) {
      sessionStorage.setItem("user", user)
      setUser(user)
      setAuthenticated(true) 
    
      return true
    }

    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem("user")
    setUser(null)
    setAuthenticated(false)

    navigate("/")
  }, [navigate])

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout
  }), [user, isAuthenticated, login, logout])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
