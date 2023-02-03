import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
const SELECTED_GEO_FILL = "#FFA500";

export default function Home() {
  const [selectedGeo, setSelectedGeo] = useState({
    id: "",
    name: "Select a country",
  });

  const navigate = useNavigate();

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">World Income</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">About</a>
              </li>
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      <h1 className="text-center display-1 mt-4">{selectedGeo.name}</h1>
      <p className="lead text-center">To get started, select a country on the map</p>
      <ComposableMap>
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                stroke="#000000"
                strokeWidth={0.25}
                style={{
                  default: {
                    fillOpacity: selectedGeo.id === geo.id ? 0.75 : 0,
                    outline: "none",
                  },
                  hover: {
                    fillOpacity: 0.75,
                    outline: "none",
                  },
                  pressed: {
                    outline: "none",
                  },
                }}
                fill={SELECTED_GEO_FILL}
                onClick={() => navigate(`/${selectedGeo.name}`)}
                onMouseEnter={() =>
                  setSelectedGeo({
                    id: geo.id,
                    name: geo.properties.name,
                  })
                }
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </>
  );
}
