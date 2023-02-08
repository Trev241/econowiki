import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CountryInfo from "../components/CountryInfo";

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [centered, setCentered] = useState();

  const [info, setInfo] = useState({});
  const [country, setCountry] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [indicatorLoading, setIndicatorLoading] = useState(true);
  const [countryLoading, setCountryLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);

  const geoRef = useRef(null);

  const params = useParams();

  useEffect(() => {
    setCountryLoading(true);
    setIndicatorLoading(true);
    setInfoLoading(true);
    
    axios.get("http://localhost:5001/country/" + params.id)
      .then(({ data }) => {
        setCountry(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setCountryLoading(false);
      });
    axios.get("http://localhost:5001/indicator")
      .then(({ data }) => {
        setIndicators(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIndicatorLoading(false);
      });

    axios.get("http://localhost:5001/value/" + params.id)
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setInfoLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (geoRef.current && !centered) {
      // const ratio = window.innerWidth / window.innerHeight
      // const width = Math.min(window.innerHeight * ratio, window.innerWidth)
      // const height = Math.min(window.innerWidth / ratio, window.innerHeight)

      const bounds = geoRef.current.path.bounds(geoRef.current.geo);
      const boundsWidth = bounds[1][0] - bounds[0][0];
      const boundsHeight = bounds[1][1] - bounds[0][1];

      const zoom =
        0.25 /
        Math.max(
          boundsWidth / window.innerWidth,
          boundsHeight / window.innerHeight
        );

      // Adjust map to focus on selected country
      setCenter(
        geoRef.current.projection.invert(
          geoRef.current.path.centroid(geoRef.current.geo)
        )
      );
      setZoom(zoom);
      setCentered(true);
    }
  });

  return (
    <>
      <Container>
        {/* <div className="p-4">
          <Link
            to={"/"}
            className="px-3 py-2 border-0 text-dark text-decoration-none bg-light"
          >
            {"<"}
          </Link>
        </div> */}
      
        <Row className="mt-5 mb-5 text-center">
          {!countryLoading ? (
            <>
              <Col className="d-flex align-items-center">
                <Container fluid>
                  <h1 className="display-1">{country.name}</h1>
                  <p className="lead">({country.iso_alpha_2_code}, {country.iso_alpha_3_code}, {country.un_code})</p>
                </Container>
              </Col>
              <Col className="d-flex align-items-center" xs={4}>
                <Container fluid>
                  <ComposableMap className="border border-dark rounded" projection="geoMercator">
                    <ZoomableGroup center={center} zoom={zoom}>
                      <Geographies
                        geography={WORLD_GEO_URL}
                        onLoad={() => {
                          console.log("loaded");
                        }}
                      >
                        {({ geographies, projection, path }) => {
                          const geo = geographies.find((geo) => geo.id === params.id);
                          geoRef.current = { geo, projection, path };
                          return <Geography key={geo.rsmKey} geography={geo} />;
                        }}
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                </Container>
              </Col>
            </>
          ) : (
            <></>
          )}
        </Row>
      </Container>

      <hr className="my-5" />

      {indicatorLoading || infoLoading ? (
        <div
          className="spinner-border"
          role="status"
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <CountryInfo info={info} indicators={indicators} />
      )}
    </>
  );
}
