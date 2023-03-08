import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { TbCurrentLocation } from "react-icons/tb";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { AuthContext } from "../components/AuthProvider";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
const SELECTED_GEO_FILL = "#FFA500";

export default function Home() {
  const navigate = useNavigate();
  const { user, country, setCountry, countries } = useContext(AuthContext);

  return (
    <Container fluid>
      <Row>
        {country.iso_alpha_3_code && (
          <div
            style={{
              position: "absolute",
              left: `0%`,
              top: `50%`,
              textAlign: "center",
              fontWeight: "bold",
              WebkitTextStroke: "2px black",
              WebkitTextFillColor: "white",
              fontSize: "3rem",
              textTransform: "uppercase",
              padding: 0,
              fontFamily: "monospace",
              userSelect: "none",
            }}
          >
            <TbCurrentLocation
              style={{ fontSize: "2rem", marginRight: "0.5rem" }}
            />
            {country.name}
          </div>
        )}
        <Col>
          <Container fluid>
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
                          fillOpacity:
                            country.iso_alpha_3_code === geo.id ? 0.75 : 0,
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
                      onClick={() => {
                        if (user) {
                          navigate(`/${country.iso_alpha_3_code}`);
                        }
                      }}
                      onMouseEnter={() => {
                        setCountry(
                          countries.find((c) => c.iso_alpha_3_code === geo.id)
                        );
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
  );
}
