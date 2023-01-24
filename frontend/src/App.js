import './App.css';
import MapChart from './components/MapChart';
import Country from './components/Country';
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MapChart />} />
        <Route path=":id" element={<Country id='IND' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
