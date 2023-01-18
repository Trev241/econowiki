import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const WORLD_GEO_URL = 
    'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'
const SELECTED_GEO_FILL = '#FFA500'

export default function MapChart() {
  const [selectedGeoId, setSelectedGeoId] = useState()
  const [selectedGeoName, setSelectedGeoName] = useState()

  return (
    <>
      <h1 className='text-center display-1'>{selectedGeoName}</h1>
      <ComposableMap>
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography 
                key={geo.rsmKey} 
                geography={geo}
                stroke='#000000'
                strokeWidth={.25}
                style={{
                  default: {
                    fillOpacity: selectedGeoId === geo.id ? 1 : 0
                  }, 
                  hover: {
                    fillOpacity: .75
                  },
                }}
                fill={SELECTED_GEO_FILL} 
                onClick={_ => {
                  setSelectedGeoId(geo.id)
                  setSelectedGeoName(geo.properties.name)
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </>
  )
}
