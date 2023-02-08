import React from "react";

import Container from "react-bootstrap/Container";
import { ResponsiveContainer } from "recharts";

export default function Chart({ name, description, chart, styles = {} }) {
  return (
    <Container style={styles}>
      <h1 className="display-6">{name}</h1>
      <p className="lead">{description}</p>

      <ResponsiveContainer aspect={3/1}>
        {chart}
      </ResponsiveContainer>
    </Container>
  );
}
