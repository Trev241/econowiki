import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup,
// } from "react-simple-maps";
import { FiEdit2 } from "react-icons/fi";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import { cAxios, UserType } from "../constants";
import Spinner from "../components/Spinner";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  Legend,
} from "recharts";
import { AuthContext } from "../components/AuthProvider";
import ErrorModal from "../components/ErrorModal";
import Sidebar from "../components/Sidebar";

// const WORLD_GEO_URL =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  // const [zoom, setZoom] = useState(1);
  // const [center, setCenter] = useState([0, 0]);
  // const [centered, setCentered] = useState();

  const [country, setCountry] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [formattedData, setFormattedData] = useState();
  const [recordCount, setRecordCount] = useState();

  const [isLoading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('Something went wrong...');

  // const geoRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let response;

        // Fetch country
        response = await cAxios.get(`/country/${params.id}`);
        const _country = response.data;
        setCountry(_country);

        // Fetch indicators
        response = await cAxios.get(`/indicator`);
        const _indicators = response.data;
        setIndicators(_indicators);

        // Fetch values
        response = await cAxios.get(`/value/${params.id}?withProjected=true`);
        const _values = response.data;

        // Reformat as list to be consumed by recharts
        const finalData = Object.keys(_values).map((indicator) => ({
            indicator_id: _values[indicator].indicator_id,
            data: Object.keys(_values[indicator].data).map((year) => ({
              year: year,
              value: _values[indicator].data[year].value || null,
              prediction: _values[indicator].data[year].prediction || null,
              axisValue: _values[indicator].data[year].value || _values[indicator].data[year].prediction
            }))
          })  
        );

        let count = 0;
        finalData.forEach(dataset => dataset.data.forEach(() => count++));
        setRecordCount(count);

        setFormattedData(finalData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setShowError(true);
        setError({
          status: `${err.response.status} (${err.response.statusText})`,
          message: err.response.data.message
        });
        // navigate("/")
      }
    })();
  }, [params]);

  // useEffect(() => {
  //   if (geoRef.current && !centered) {
  //     // const ratio = window.innerWidth / window.innerHeight
  //     // const width = Math.min(window.innerHeight * ratio, window.innerWidth)
  //     // const height = Math.min(window.innerWidth / ratio, window.innerHeight)

  //     const bounds = geoRef.current.path.bounds(geoRef.current.geo);
  //     const boundsWidth = bounds[1][0] - bounds[0][0];
  //     const boundsHeight = bounds[1][1] - bounds[0][1];

  //     const zoom =
  //       0.25 /
  //       Math.max(
  //         boundsWidth / window.innerWidth,
  //         boundsHeight / window.innerHeight
  //       );

  //     // Adjust map to focus on selected country
  //     setCenter(
  //       geoRef.current.projection.invert(
  //         geoRef.current.path.centroid(geoRef.current.geo)
  //       )
  //     );
  //     setZoom(zoom);
  //     setCentered(true);
  //   }
  // });

  return isLoading ? (
    <>
      <Spinner />
      <ErrorModal 
          show={showError}
          heading={`Error ${error.status}`}
          message={error.message}
          onHide={() => navigate("/")}
      />
    </>
  ) : (
    <Container fluid className="p-0">
      <Row>
        <Col sm={3}>
          <Sidebar
            items={indicators.reduce((a, v) => ({ ...a, [v.name]: v.short_name }), {})} 
          />
        </Col>

        <Col sm={9}>
          {/* <Container fluid>
            <Row className="text-center d-flex align-items-center justify-content-center m-5">
              <Col xs={4}>
                <Container fluid>
                  <h1
                    className="display-6"
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {country.name}
                  </h1>
                  <p className="lead">
                    ({country.iso_alpha_2_code}, {country.iso_alpha_3_code},{" "}
                    {country.un_code})
                  </p>
                </Container>
              </Col>
              <Col xs={4}>
                <Container fluid>
                  <ComposableMap
                    className="border border-secondary rounded"
                    projection="geoMercator"
                  >
                    <ZoomableGroup center={center} zoom={zoom}>
                      <Geographies geography={WORLD_GEO_URL}>
                        {({ geographies, projection, path }) => {
                          const geo = geographies.find(
                            (geo) => geo.id === params.id
                          );
                          geoRef.current = { geo, projection, path };
                          return geo ? (
                            <Geography key={geo.rsmKey} geography={geo} />
                          ) : (
                            <h1>No available map</h1>
                          );
                        }}
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                </Container>
              </Col>
            </Row>
          </Container> */}


          <Container fluid className="my-5">
            <div className="mb-5">
              <h1>{country.name}</h1>
              <div>
                <b>Codes</b>: {country.iso_alpha_2_code}/{country.iso_alpha_3_code}/{country.un_code}
              </div>
              <div>
                <b>Records</b>: {recordCount || "N/A"} (including projected values)
              </div>
            </div>
            {formattedData.map((dataset) => {
              let indicator = indicators.find(indicator => indicator.id === dataset.indicator_id);
              return (
                <Row id={indicator.short_name} key={indicator.id} className="mb-5">
                  <div className="d-flex">
                    <h2>{indicator.name}</h2>
                    {user.type !== UserType.MEMBER && (
                      <Dropdown className="ms-auto">
                        <Dropdown.Toggle variant="outline-dark">
                          <FiEdit2 />&nbsp;&nbsp;&nbsp;Edit
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item 
                            onClick={() => navigate(`/values/?country=${country.iso_alpha_3_code}&indicator=${indicator.id}`)}
                          >
                            Values
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => navigate("/indicators")}>
                            Indicator
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  <p className="lead mb-4">{indicator.description}</p>
                  
                  <div className="px-2">
                    <ResponsiveContainer aspect={3 / 1}>
                      <LineChart data={dataset.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={"year"} />
                        <YAxis dataKey={"axisValue"} />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                          name="Actual"
                          type={"monotone"}
                          dataKey="value"
                          stroke="#222222"
                        />
                        <Line
                          name="Projected"
                          type={"monotone"}
                          dataKey="prediction"
                          stroke="#0000FF"
                        />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Row>
            )})}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
