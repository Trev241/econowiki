import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Private, Public } from "./components/AuthenticationGuard";
import { AuthContext } from "./components/AuthProvider";
import NavigationBar from "./components/NavigationBar";
import Spinner from "./components/Spinner";
import { cAxios } from "./constants";
import Country from "./pages/Country";
import CountryEdit from "./pages/CountryEdit";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const { loading, setLoading, setUser } = useContext(AuthContext);
  useEffect(() => {
    setLoading(true);
    cAxios
      .get("/auth/user")
      .then((res) => {
        if (res.data.status === 200) {
          setUser(res.data.user);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route index element={<Home />} />
        <Route element={<Public component={Login} />} path="/login" />
        <Route element={<Private component={Country} />} path="/:id" />
        <Route element={<Private component={CountryEdit} />} path="/edit" />
        <Route element={<Private component={Dashboard} />} path="/dashboard" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
