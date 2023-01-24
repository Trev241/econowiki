import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useNavigate } from "react-router-dom"

const WORLD_GEO_URL = 
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'
const SELECTED_GEO_FILL = '#FFA500'

export default function MapChart() {
  const [selectedGeo, setSelectedGeo] = useState({
    id: '',
    name: 'Select a country'
  })

  const navigate = useNavigate()

  return (
    <>
      <h1 className='text-center display-1'>{selectedGeo.name}</h1>
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
                    fillOpacity: 0,
                    outline: 'none'
                  }, 
                  hover: {
                    fillOpacity: .75,
                    outline: 'none'
                  },
                  pressed: {
                    outline: 'none'
                  }
                }}
                fill={SELECTED_GEO_FILL} 
                onClick={_ => navigate(`/${selectedGeo.id}`)}
                onMouseEnter={_ => setSelectedGeo({
                    id: geo.id,
                    name: geo.properties.name
                })}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </>
  )
}
