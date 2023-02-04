import { useMemo } from "react";
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
import { mergeData } from "../utils";
import Chart from "./Chart";

export default function CountryInfo({ info, indicators }) {
  const modData = useMemo(() => {
    const result = [...Array(9)].map((_) => []);
    for (const value of info) {
      result[value.indicator_id - 1].push(value);
    }
    return result;
  }, [info]);

  return (
    <div className="p-4 d-flex">
      <div>
        <Chart
          name={indicators[8].name.toUpperCase()}
          description={indicators[8].description}
          chart={
            <LineChart width={600} height={300} data={modData[8]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"year"} />
              <YAxis dataKey={"value"} />
              <Line type={"monotone"} dataKey="value" stroke="#222222" />
              <Tooltip />
            </LineChart>
          }
        />
        <Chart
          name={indicators[1].name.toUpperCase()}
          description={indicators[1].description}
          chart={
            <AreaChart width={600} height={300} data={modData[1]}>
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
          styles={{ marginTop: "200px" }}
        />
        <Chart
          name={indicators[3].name.toUpperCase()}
          description={indicators[3].description}
          chart={
            <ScatterChart width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Scatter data={modData[3]} fill="#222222" />
            </ScatterChart>
          }
          styles={{ marginTop: "200px" }}
        />
        <Chart
          name={indicators[6].name.toUpperCase()}
          description={indicators[6].description}
          chart={
            <FunnelChart width={600} height={400}>
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
          styles={{
            marginTop: "200px",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "200px",
        }}
      >
        <Chart
          name={indicators[0].name.toUpperCase()}
          description={indicators[0].description}
          chart={
            <BarChart width={600} height={300} data={modData[0]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#222222" />
            </BarChart>
          }
        />
        <Chart
          name={indicators[2].name.toUpperCase()}
          description={indicators[2].description}
          chart={
            <BarChart width={600} height={300} data={modData[2]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          }
          styles={{
            marginTop: "200px",
          }}
        />
        <Chart
          name={indicators[7].name.toUpperCase()}
          description={indicators[7].description}
          chart={
            <BarChart width={600} height={300} data={modData[7]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#222222" />
            </BarChart>
          }
          styles={{
            marginTop: "200px",
          }}
        />
        <Chart
          name={`${indicators[4].short_name.toUpperCase()} & ${indicators[5].short_name.toUpperCase()}`}
          description={indicators[4].description}
          chart={
            <LineChart
              width={600}
              height={300}
              data={mergeData(modData[5], modData[4])}
            >
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
          styles={{
            marginTop: "200px",
          }}
        />
      </div>
    </div>
  );
}
