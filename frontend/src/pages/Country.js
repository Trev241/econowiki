import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { FiEdit2 } from "react-icons/fi";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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

const WORLD_GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function Country() {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [centered, setCentered] = useState();

  const [country, setCountry] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [formattedData, setFormattedData] = useState();

  const [isLoading, setLoading] = useState(true);

  const geoRef = useRef(null);
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
        response = await cAxios.get(`/value/${params.id}`);
        const _values = response.data;

        // Fetch predictions
        let _predictions = [];
        let minYear = _values[0]?.year;
        let maxYear = _values[0]?.year;
        // It is better to use a regular for-of loop here instead of a forEach callback
        // await behaviour is more conistent here compared to passing an async callback
        for (const indicator of _indicators) {
          for (const entry of _values) {
            if (entry.indicator_id === indicator.id) {
              maxYear = Math.max(maxYear, entry.year);
              minYear = Math.min(minYear, entry.year);
            }
          }

          let years = [];
          for (let year = minYear; year <= maxYear + 3; year++)
            years.push(year);

          const response = await cAxios.post(`/prediction`, {
            iso_alpha_3_code: _country.iso_alpha_3_code,
            indicator_short_name: indicator.short_name,
            years: years,
          });

          const result = response.data;
          _predictions.push(result);
        }

        // Grouping values according to economic indicator
        const data = [...Array(_indicators.length)].map(() => ({}));
        for (const entry of _values) {
          data[entry.indicator_id - 1][entry.year] = {
            ...entry,
            prediction: null,
          };
        }

        // Including predictions
        _predictions.forEach((predictionSet, idx) => {
          Object.keys(predictionSet).forEach((year) => {
            const future = !data[idx][year] && year >= maxYear;
            // Create data point
            if (future)
              data[idx][year] = {
                year: year,
                value: null,
              };

            // Set projected values for current and near future
            if (data[idx][year]?.value || future)
              data[idx][year].prediction = predictionSet[year];
          });
        });

        // Reconstruct as list to be consumed by recharts
        const finalData = data.map((datasubset) =>
          Object.keys(datasubset).map((year) => ({
            year: year,
            value: datasubset[year].value,
            prediction: datasubset[year].prediction,
          }))
        );

        setFormattedData(finalData);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    })();
  }, [params]);

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

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <Container>
        <Row
          className="text-center d-flex align-items-center justify-content-center"
          style={{
            margin: "5rem",
          }}
        >
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
                      return <Geography key={geo.rsmKey} geography={geo} />;
                    }}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* <CountryInfo country={country} info={info} indicators={indicators} predictions={predictions} modData={formattedData} /> */}

      <Container className="my-5">
        {formattedData.map((dataset, idx) => (
          <Row key={idx} className="mb-5">
            <div className="d-flex">
              <h1 className="display-6">{indicators[idx].name}</h1>
              {user.type !== UserType.MEMBER && (
                <Button
                  variant="outline-dark"
                  className="ms-auto my-2"
                  onClick={() =>
                    navigate(
                      `/values/?country=${country.iso_alpha_3_code}&indicator=${
                        idx + 1
                      }` || "/edit"
                    )
                  }
                >
                  <FiEdit2 />
                </Button>
              )}
            </div>
            <p className="lead mb-4">{indicators[idx].description}</p>

            {/* TODO: YAxis datakey should be set to the highest number (either value or prediction) to avoid lines from going outside the charts */}
            <ResponsiveContainer aspect={3 / 1}>
              <LineChart data={dataset}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={"year"} />
                <YAxis dataKey={"value"} />
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
          </Row>
        ))}
      </Container>
    </>
  );
}
