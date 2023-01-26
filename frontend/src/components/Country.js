import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1)

  const params = useParams();

  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup center={center} zoom={zoom}>
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies, projection, path }) => {
            const geo = geographies.find((geo) => geo.id === params.id);

            if (geo) {
              // const ratio = window.innerWidth / window.innerHeight
              // const width = Math.min(window.innerHeight * ratio, window.innerWidth)
              // const height = Math.min(window.innerWidth / ratio, window.innerHeight)

              const bounds = path.bounds(geo)
              const boundsWidth = bounds[1][0] - bounds[0][0]
              const boundsHeight = bounds[1][1] - bounds[0][1]

              const zoom = .25 / Math.max(boundsWidth / window.innerWidth, boundsHeight / window.innerHeight)
              
              // Adjust map to focus on selected country
              setCenter(projection.invert(path.centroid(geo)));
              setZoom(zoom)

              return <Geography key={geo.rsmKey} geography={geo} />;
            }
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
