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

  const params = useParams();

  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup center={center} zoom={1}>
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies, projection, path }) => {
            const geo = geographies.find((geo) => geo.id === params.id);

            if (geo) {
              setCenter(projection.invert(path.centroid(geo)));

              return <Geography key={geo.rsmKey} geography={geo} />;
            }
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
