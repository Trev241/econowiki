import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
const SELECTED_GEO_FILL = "#FFA500";

export default function Home() {
  const [selectedGeo, setSelectedGeo] = useState({
    id: "",
    name: "Select a country",
  });
  const [countries, setCountries] = useState()

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5001/country")
      setCountries(await response.json())
    }

    fetchData()
  }, [countries])

  return (
    <>
      <Container>
        <Row className="text-center my-3">
          <Col>
            {/* <h1 className="display-1">{selectedGeo.name}</h1>
            <p className="display-6">
              Learn everything there is to a country with a single click.
            </p> */}
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Col sm={3}>
            <Container fluid>
              <Row>
                <Col>
                  <Form.Select 
                    className="mb-3"
                    value={selectedGeo.id} 
                    aria-label="Select a country"
                    onChange={(e) => navigate(`/${e.target.value}`)}
                  >
                    <option>(Select a country)</option>
                    {countries && countries.map((country, i) => 
                      <option 
                        key={i}
                        value={country.iso_alpha_3_code}
                      >
                        {country.name}
                      </option>
                    )}
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <h1 className="display-1">{selectedGeo.name}</h1>
                </Col>
              </Row>

            </Container>
          </Col>

          <Col>
            <Container fluid>
              <ComposableMap className="border border-dark rounded">
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
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
