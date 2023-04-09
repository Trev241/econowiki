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
import Signup from "./pages/Signup";
import Indicator from "./pages/Indicator";
import Error from "./pages/Error";

function App() {
  const { loading, setLoading, setUser } = useContext(AuthContext);
  useEffect(() => {
    setLoading(true);
    cAxios
      .get("/auth/user")
      .then((res) => {
        setUser(res.data);
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
        <Route element={<Public component={Signup} />} path="/signup" />
        <Route element={<Private component={Country} />} path="/:id" />
        <Route element={<Private component={CountryEdit} />} path="/values" errorElement={<Error />} />
        <Route element={<Private component={Dashboard} />} path="/dashboard" />
        <Route element={<Private component={Indicator} />} path="/indicators" />
        <Route 
          element={
            <Error 
              code="404"
              heading="PAGE NOT FOUND"
              message="The page you tried to acccess does not exist."
            />
          } 
          path="*" 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
