import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const WORLD_GEO_URL = 
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"
  // "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/argentina/argentina-provinces.json"

export default function Map() {
  const { id } = useParams();
  return (
    <>
      <h1 className='text-center display-1'>{id}</h1>
      <ComposableMap>
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) => {
              const geo = geographies.find(geo => geo.id === id)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}

                />
              )
            }
          }

          {/* {({ geographies }) => {
            geographies.map((geo) =>
              <Geography 
                key={geo.rsmKey}
                geography={geo}
              />
            )
          }} */}
        </Geographies>
      </ComposableMap>
    </>
  )
}