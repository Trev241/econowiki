import Home from "./pages/Home";
import Country from "./pages/Country";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";

function App() {
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
