import { createContext, useMemo, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({});

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      countries,
      setCountries,
      country,
      setCountry,
    }),
    [user, loading, countries, country]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
