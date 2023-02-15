import Home from "./pages/Home";
import Country from "./pages/Country";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "./components/Spinner";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path=":id" element={<Country />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
