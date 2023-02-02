import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import CountryInfo from "../components/CountryInfo";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  const [center, setCenter] = useState([0, 0]);
  const [centered, setCentered] = useState(false);
  const [zoom, setZoom] = useState(1);

  const params = useParams();

  return (
    <>
      <div className="p-4">
        <Link
          to={"/"}
          className="px-3 py-2 border-0 text-dark text-decoration-none bg-light"
        >
          {"<"}
        </Link>
      </div>
      <div className="d-flex" style={{ padding: "1rem 4rem" }}>
        <div
          className="w-50 border"
          style={{
            height: "80vh",
            cursor: "grab",
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
        <div className="w-50 d-flex justify-content-center align-items-center">
          <span className="display-4">{params.id}</span>
        </div>
      </div>
      <CountryInfo id={params.id} />
    </>
  );
}
