import React, { useCallback, useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import FormError from "../components/FormError";
import Logo from "../components/Logo";
import authService from "../services/AuthService";
import Spinner from "react-bootstrap/Spinner";
import { BiErrorCircle } from "react-icons/bi";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({
    nameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    nameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const updateForm = (e) => {
    const entry = { [e.target.name]: e.target.value };
    setForm({ ...form, ...entry });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const _errors = {};
      if (form.nameOrEmail.trim().length === 0)
        _errors.nameOrEmail = "Name/Email must not be empty!";
      if (form.password.trim().length < 8)
        _errors.password = "Password length must be >= 8!";

      setErrors(_errors);
      setServerError("");

      if (JSON.stringify(_errors) === "{}") {
        setLoading(true);
        await authService.login(
          form.nameOrEmail,
          form.password
        )
        .then(response => {
          setUser(response.data);
          navigate("/");
        })
        .catch(error => {
          console.log(error);
          setServerError(error?.response?.data?.message || error.message);
        });

        setLoading(false);
      }
    },
    [form, navigate, setUser]
  );

  return (
    <div className="d-flex align-items-center m-4">
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
              <Logo
                color={"dark"}
                styles={{ textAlign: "center", marginBottom: "2rem" }}
              />

              {serverError && (
                <Alert
                  className="mb-4"
                  variant="danger"
                  style={{ fontSize: "0.8rem" }}
                >
                  <BiErrorCircle /> &nbsp;{serverError}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Name/Email</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                  name="nameOrEmail"
                  value={form.nameOrEmail}
                  onChange={(e) => updateForm(e)}
                  style={{ border: errors.nameOrEmail && "1px solid red" }}
                />
                <FormError message={errors.nameOrEmail} />
              </Form.Group>

              <Form.Group className="mb-5">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => updateForm(e)}
                  style={{ border: errors.password && "1px solid red" }}
                />
                <FormError message={errors.password} />
              </Form.Group>

              <Button className="w-100" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
