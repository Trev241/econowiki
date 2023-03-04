import React, { useCallback, useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import authService from "../services/AuthService";

export default function Login() {
  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const [form, setForm] = useState({
    nameOrEmail: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const updateForm = (e) => {
    const entry = { [e.target.name]: e.target.value };
    setForm({ ...form, ...entry });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const response = await authService.login(form.nameOrEmail, form.password);
      if (response.data.status === 200) {
        setUser(response.data.user);
        navigate("/");
        return;
      }
      setShowFailedAlert(true);
    },
    [form, navigate, setUser]
  );

  return (
    <div className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            <Form
              onSubmit={handleSubmit}
              className="border rounded p-5"
              style={{
                borderColor: "rgb(180, 180, 180)",
              }}
            >
              <h1 className="mb-5">Login</h1>

              {showFailedAlert && (
                <Alert className="mb-4" variant="danger">
                  Failed to log in
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Name/Email</Form.Label>
                <Form.Control
                  type="text"
                  name="nameOrEmail"
                  value={form.username}
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

              <Button className="w-100" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
