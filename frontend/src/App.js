import Home from "./pages/Home";
import Country from "./pages/Country";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import CountryEdit from "./pages/CountryEdit";
import { AuthProvider } from "./components/AuthProvider";
import AuthenticationGuard from "./components/AuthenticationGuard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <NavigationBar />
          <Routes>
            {/* <Route path=":id" element={<Country />} /> */}
            {/* <Route path="edit" element={<CountryEdit />} /> */}
            <Route index element={<Home />} />
            <Route element={<Login />} path="/login" />
            <Route element={<AuthenticationGuard component={Country} />} path="/:id" />
            <Route element={<AuthenticationGuard component={CountryEdit} />} path="/edit" />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
