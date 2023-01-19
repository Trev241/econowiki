import './App.css';
import MapChart from './components/MapChart';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Map from './components/Map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MapChart />} />
        <Route path=":id" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
