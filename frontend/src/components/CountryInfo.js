import axios from "axios";
import { useEffect, useMemo, useState } from "react";
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

export default function CountryInfo({ id }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/" + id)
      .then(({ data }) => {
        setData(JSON.parse(data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const modData = useMemo(() => {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = [];
      for (const _key of Object.keys(JSON.parse(data[key]))) {
        result[key].push({
          year: _key,
          value: JSON.parse(data[key])[_key],
        });
      }
    }
    return result;
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 d-flex">
      <div>
        <Chart
          name={"INCOME INDEX"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <LineChart width={600} height={300} data={modData["INCOME_INDEX"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"year"} />
              <YAxis dataKey={"value"} />
              <Line type={"monotone"} dataKey="value" stroke="#222222" />
              <Tooltip />
            </LineChart>
          }
        />
        <Chart
          name={"DOMESTIC CREDITS"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <AreaChart
              width={600}
              height={300}
              data={modData["DOMESTIC_CREDITS"]}
            >
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
          name={"GDP"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <ScatterChart width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Scatter data={modData["GDP"]} fill="#222222" />
            </ScatterChart>
          }
          styles={{ marginTop: "200px" }}
        />
        <Chart
          name={"LABOUR SHARE"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <FunnelChart width={600} height={400}>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={modData["LABOUR_SHARE"]}
                isAnimationActive
              >
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
          name={"CAPITAL"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <BarChart width={600} height={300} data={modData["CAPITAL"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Bar dataKey="value" fill="#222222" />
            </BarChart>
          }
        />
        <Chart
          name={"GDP & GNI PER CAPITA"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <BarChart
              width={600}
              height={300}
              data={mergeData(
                modData["GDP_PER_CAPITA"],
                modData["GNI_PER_CAPITA"]
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value1" />
              <Tooltip />
              <Bar dataKey="value1" fill="#222222" />
              <Bar dataKey="value2" fill="#FFA500" />
            </BarChart>
          }
          styles={{
            marginTop: "200px",
          }}
        />
        <Chart
          name={"GNI MALE & GNI FEMALE"}
          description={
            "Pandas series is a One-dimensional ndarray with axis labels. The labels need not be unique but must be a hashable type."
          }
          chart={
            <LineChart
              width={600}
              height={300}
              data={mergeData(modData["GNI MALE"], modData["GNI_FEMALE"])}
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
