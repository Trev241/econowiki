import { useCallback, useContext, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { VscListSelection } from "react-icons/vsc";

import { mergeData } from "../utils";
import { AuthContext } from "./AuthProvider";
import Chart from "./Chart";

export default function CountryInfo({ country, info, indicators }) {
  const [otherCountries, setOtherCountries] = useState([]);
  const { countries } = useContext(AuthContext);

  const modData = useMemo(() => {
    const result = [...Array(9)].map(() => []);
    for (const value of info) {
      result[value.indicator_id - 1].push(value);
    }
    return result;
  }, [info]);

  console.log(modData);

  const handleSelectChange = useCallback(async (e) => {
    setOtherCountries((prev) => [...prev, e.target.value]);
  }, []);

  return (
    <Container>
      <Row className="my-3">
        <span className="m-2">
          <VscListSelection /> &nbsp;Comparison
        </span>
        <div className="d-flex align-items-center">
          <Form.Select
            className="me-2"
            onChange={handleSelectChange}
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
            disabled={otherCountries.length >= 10}
          >
            <option> {">"} Select a country</option>
            {countries.map((country, i) => (
              <option
                key={i}
                value={country.iso_alpha_3_code}
                disabled={otherCountries.includes(country.iso_alpha_3_code)}
              >
                {country.name}
              </option>
            ))}
          </Form.Select>
          <span style={{ color: "rgb(150, 150, 150)" }}>
            {otherCountries.length}&nbsp;/&nbsp;10
          </span>
        </div>
        <div className="p-2">
          {otherCountries.map((iso3, i) => (
            <Badge bg="dark" key={i} className={"m-2 p-3"}>
              <span
                className="border border-white text-white rounded-circle px-1"
                style={{
                  cursor: "pointer",
                  fontSize: "0.7rem",
                }}
                onClick={() =>
                  setOtherCountries(
                    otherCountries.filter((_iso3) => _iso3 !== iso3)
                  )
                }
              >
                x
              </span>
              &nbsp;&nbsp;{iso3}
            </Badge>
          ))}
        </div>
      </Row>

      <Row className="my-5">
        <Chart
          name={indicators[8].name.toUpperCase()}
          description={indicators[8].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${9}`}
          chart={
            <LineChart data={modData[8]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"year"} />
              <YAxis dataKey={"value"} />
              <Line type={"monotone"} dataKey="value" stroke="#222222" />
              <Tooltip />
            </LineChart>
          }
        />
      </Row>

      <Row className="mb-5">
        <Chart
          name={indicators[1].name.toUpperCase()}
          description={indicators[1].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${2}`}
          chart={
            <AreaChart data={modData[1]}>
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#222222"
                fill="#FFA500"
              />
              <Tooltip />
            </AreaChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={indicators[3].name.toUpperCase()}
          description={indicators[3].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${4}`}
          chart={
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Scatter data={modData[3]} fill="#222222" />
            </ScatterChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={indicators[6].name.toUpperCase()}
          description={indicators[6].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${7}`}
          chart={
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={modData[6]} isAnimationActive>
                <LabelList
                  position="center"
                  fill="#FFFFFF"
                  stroke="none"
                  dataKey="year"
                />
              </Funnel>
            </FunnelChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={indicators[0].name.toUpperCase()}
          description={indicators[0].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${1}`}
          chart={
            <BarChart data={modData[0]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#222222" />
            </BarChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={indicators[2].name.toUpperCase()}
          description={indicators[2].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${3}`}
          chart={
            <BarChart data={modData[2]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={indicators[7].name.toUpperCase()}
          description={indicators[7].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${8}`}
          chart={
            <BarChart data={modData[7]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#222222" />
            </BarChart>
          }
        />
      </Row>
      <Row className="mb-5">
        <Chart
          name={`${indicators[4].short_name.toUpperCase()} & ${indicators[5].short_name.toUpperCase()}`}
          description={indicators[4].description}
          editRedirect={`/edit/?country=${
            country.iso_alpha_3_code
          }&indicator=${5}`}
          chart={
            <LineChart data={mergeData(modData[5], modData[4])}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"year"} />
              <YAxis dataKey={"value1"} />
              <Line
                name="Male"
                type={"monotone"}
                dataKey="value1"
                stroke="#222222"
              />
              <Line
                name="Female"
                type={"monotone"}
                dataKey="value2"
                stroke="#FFA500"
              />
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
            </LineChart>
          }
        />
      </Row>
    </Container>
  );
}
