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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            World Income
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  About
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <h1 className="text-center display-1 mt-4">{selectedGeo.name}</h1>
      <p className="lead text-center">
        To get started, select a country on the map
      </p>
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
                onClick={() => navigate(`/${selectedGeo.id}`)}
                onMouseEnter={() => {
                  setSelectedGeo({
                    id: geo.id,
                    name: geo.properties.name,
                  });
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </>
  );
}
