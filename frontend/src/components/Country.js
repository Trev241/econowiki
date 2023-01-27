import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import CountryStats from "./CountryStats";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  const [center, setCenter] = useState([0, 0]);
  const [centered, setCentered] = useState(false);
  const [zoom, setZoom] = useState(1);

  const params = useParams();

  return (
    <>
      <div
        style={{
          padding: "1rem",
        }}
      >
        <Link
          to={"/"}
          style={{
            padding: "10px 15px",
            border: "none",
            textDecoration: "none",
            backgroundColor: "rgb(230, 230, 230)",
            color: "black",
          }}
        >
          {"<"}
        </Link>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100vh",
          }}
        >
          <ComposableMap projection="geoMercator">
            <ZoomableGroup center={center} zoom={zoom}>
              <Geographies geography={WORLD_GEO_URL}>
                {({ geographies, projection, path }) => {
                  const geo = geographies.find(
                    (geo) => geo.properties.name === params.id
                  );

                  if (geo && !centered) {
                    // const ratio = window.innerWidth / window.innerHeight
                    // const width = Math.min(window.innerHeight * ratio, window.innerWidth)
                    // const height = Math.min(window.innerWidth / ratio, window.innerHeight)

                    const bounds = path.bounds(geo);
                    const boundsWidth = bounds[1][0] - bounds[0][0];
                    const boundsHeight = bounds[1][1] - bounds[0][1];

                    const zoom =
                      0.25 /
                      Math.max(
                        boundsWidth / window.innerWidth,
                        boundsHeight / window.innerHeight
                      );

                    // Adjust map to focus on selected country
                    setCenter(projection.invert(path.centroid(geo)));
                    setCentered(true);
                    setZoom(zoom);
                  }
                  return <Geography key={geo.rsmKey} geography={geo} />;
                }}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "5rem",
            }}
          >
            {params.id}
          </span>
        </div>
      </div>
      <CountryStats id={params.id} />
    </>
  );
}
