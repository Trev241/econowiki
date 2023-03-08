import React, { useCallback, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { TiTick } from "react-icons/ti";
import Logo from "../components/Logo";
import authService from "../services/AuthService";

export default function Signup() {
  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showRegistered, setShowRegistered] = useState(false);

  const updateForm = (e) => {
    const entry = { [e.target.name]: e.target.value };
    setForm({ ...form, ...entry });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const response = await authService.signup(
        form.username,
        form.email,
        form.password
      );
      if (response.data.status === 200) {
        setShowRegistered(true);
        return;
      }
      setShowFailedAlert(true);
    },
    [form]
  );

  return (
    <div className="d-flex align-items-center m-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            {showRegistered ? (
              <div className="d-flex flex-column align-items-center">
                <span className="text-success display-6">
                  <TiTick />
                </span>
                <span style={{ fontWeight: "bold", marginTop: "1rem" }}>
                  You have registered successfully!
                </span>
                <span style={{ fontSize: "0.9rem" }}>
                  Admin will respond to your request as soon as possible!
                </span>
                <span style={{ fontSize: "0.8rem" }}>
                  Until then, Happy Surfing!
                </span>
              </div>
            ) : (
              <Form
                onSubmit={handleSubmit}
                className="border rounded p-5"
                style={{
                  borderColor: "rgb(180, 180, 180)",
                }}
              >
                <Logo
                  color={"dark"}
                  styles={{ textAlign: "center", marginBottom: "2rem" }}
                />

                {showFailedAlert && (
                  <Alert className="mb-4" variant="danger">
                    Failed to log in
                  </Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    autoFocus
                    name="username"
                    value={form.username}
                    onChange={(e) => updateForm(e)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    autoFocus
                    name="email"
                    value={form.email}
                    onChange={(e) => updateForm(e)}
                  />
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => updateForm(e)}
                  />
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm(e)}
                  />
                </Form.Group>

                <Button className="w-100" type="submit">
                  SignUp
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
