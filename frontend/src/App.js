import Home from "./pages/Home";
import Country from "./pages/Country";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path=":id" element={<Country />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
