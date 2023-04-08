import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { TbCurrentLocation } from "react-icons/tb";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../components/AuthProvider";
import "./Home.css";
import { MdCheck, MdFormatListNumbered, MdMoneyOff, MdPeople, MdSearch } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import { BiWorld } from "react-icons/bi";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { cAxios } from "../constants";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
const SELECTED_GEO_FILL = "#FFA500";

export default function Home() {
  const { user, country, setCountry, countries } = useContext(AuthContext);

  const [selectedCountry, setSelectedCountry] = useState();
  const [stats, setStats] = useState();

  useEffect(() => {
    (async () => {
      try {
        let response = await cAxios.get("/stats");
        setStats(response.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [])

  return (
    <Container fluid className="p-0">
      <div className="container-main d-flex align-items-center">
        <Container>
          <div className="text-slide-in">
            <h1 className="display-1">
              <b>
                Economic data from all across the world at your fingertips.
              </b>
            </h1>

            <h1 className="display-6 lead mb-5 text-slide-in">
              Absolutely free and community-driven.
            </h1>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="d-flex">
                <Form.Select 
                  className="me-2"
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  defaultValue="prompt"
                >
                  <option disabled value="prompt">- Select a country -</option>
                  {countries && countries.map(country => (
                    <option value={country.iso_alpha_3_code}>{country.name}</option>
                  ))}
                </Form.Select>
                <Button
                  onClick={() => window.location.href = `/${selectedCountry}`}
                  disabled={!selectedCountry}
                >
                  <MdSearch />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <hr className="mt-0 mb-5 p-0" />

      <Container className="mb-5">
        <Row className="text-center">
          <Col md className="my-4">
            <MdMoneyOff className="display-1 mb-3" />
            <h3>Free</h3>
            <p>Look up data at <b>zero</b> the cost</p>
          </Col>
          <Col md className="my-4">
            <MdCheck className="display-1 mb-3" />
            <h3>Accessible</h3>
            <p>For everyone including experts and users</p>
          </Col>
          <Col md className="my-4">
            <SlGraph className="display-1 mb-3" />
            <h3>Analytics</h3>
            <p>Forecast the future with machine learning</p>
          </Col>
          <Col md className="my-4">
            <MdPeople className="display-1 mb-3" />
            <h3>Community</h3>
            <p>Driven by people from all walks of life</p>
          </Col>
        </Row>
      </Container>

      <hr className="mb-5" />

      <Row className="mx-2 mb-5">
        {/* {country.iso_alpha_3_code && (
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
        )} */}
        <div className="text-center mb-3">
          <h1>{country?.name || "Select a country"}</h1>
          <div className="mb-2">
            <b>ISO Codes</b>: {country?.iso_alpha_2_code || "-"}/{country?.iso_alpha_3_code || "-"}
          </div>
        </div>

        <Col className="border border-dark rounded">
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
                          country?.iso_alpha_3_code === geo.id ? 0.75 : 0,
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
                        window.location.href = (`/${country.iso_alpha_3_code}`);
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
        </Col>
      </Row>

      {stats && 
        <Container className="mb-5 text-center">
          <Row>
            <Col md className="my-4">
              <div className="d-flex align-items-center justify-content-center">
                <BiWorld className="display-1 me-2 " />
                <div className="text-start w-25">
                  <h1 className="mb-0">{stats.country_count}</h1>
                  <p className="mb-0">countries</p>
                </div>
              </div>
            </Col>
            <Col md className="my-4">
              <div className="d-flex align-items-center justify-content-center">
                <MdFormatListNumbered className="display-1 me-2" />
                <div className="text-start w-25">
                  <h1 className="mb-0">{stats.value_count}</h1>
                  <p className="mb-0">values</p>
                </div>
              </div>
            </Col>
            <Col md className="my-4">
              <div className="d-flex align-items-center justify-content-center">
                <AiOutlineLineChart className="display-1 me-2" />
                <div className="text-start w-25">
                  <h1 className="mb-0">{stats.indicator_count}</h1>
                  <p className="mb-0">indicators</p>
                </div>
              </div>
            </Col>
            <Col md className="my-4">
              <div className="d-flex align-items-center justify-content-center">
                <FaUsers className="display-1 me-2" />
                <div className="text-start w-25">
                  <h1 className="mb-0">{stats.user_count}</h1>
                  <p className="mb-0">users</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      }
      </Container>
  );
}
