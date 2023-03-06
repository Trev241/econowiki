import React, { useContext } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { AuthContext } from "./AuthProvider";
import { UserType } from "../constants";

export default function Chart({
  name,
  description,
  chart,
  editRedirect,
  styles = {},
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <Container style={styles}>
      <div className="d-flex">
        <h1 className="display-6">{name}</h1>
        {user.type !== UserType.MEMBER && (
          <Button
            variant="outline-dark"
            className="ms-auto my-2"
            onClick={() => navigate(editRedirect || "/edit")}
          >
            <FiEdit2 />
          </Button>
        )}
      </div>
      <p className="lead mb-4">{description}</p>

      <ResponsiveContainer aspect={3 / 1}>{chart}</ResponsiveContainer>
    </Container>
  );
}
