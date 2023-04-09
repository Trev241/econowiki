import React, { useCallback, useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import Spinner from "react-bootstrap/Spinner";
import { BiErrorCircle } from "react-icons/bi";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import { AuthContext } from "../components/AuthProvider";
import FormError from "../components/FormError";
import "./Auth.css";
import { GiWorld } from "react-icons/gi";

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
        _errors.nameOrEmail = "This field must not be empty!";
      if (form.password.trim().length < 8)
        _errors.password = "Password must contain at least 8 characters!";

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
    <div className="d-flex align-items-center container-image">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            <Form
              onSubmit={handleSubmit}
              className="border rounded p-5 bg-light"
              style={{
                borderColor: "rgb(180, 180, 180)",
              }}
            >
              {/* <Logo
                color={"dark"}
                styles={{ textAlign: "center", marginBottom: "1rem" }}
                /> */}

              <div className="text-center mb-5">
                <GiWorld className="display-1 mb-2" />
                <h1 className="display-6">Welcome back!</h1>
                <p className="lead">Sign in to your account</p>
              </div>
              
              {serverError && (
                <Alert
                  className="mb-4"
                  variant="danger"
                  style={{ fontSize: "0.8rem" }}
                >
                  <BiErrorCircle /> &nbsp;{serverError}
                </Alert>
              )}
              
              <FloatingLabel
                controlId="floatingInput"
                label="Username or email address"
                className="mb-2"
              >
                <Form.Control 
                  type="text" 
                  placeholder="name@example.com" 
                  name="nameOrEmail"
                  value={form.nameOrEmail}
                  onChange={(e) => updateForm(e)}
                  style={{ border: errors.nameOrEmail && "1px solid red" }}
                />
                <FormError message={errors.nameOrEmail} />
              </FloatingLabel>

              <FloatingLabel 
                controlId="floatingPassword" 
                label="Password"
                className="mb-4"
              >
                <Form.Control 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={form.password}
                  style={{ border: errors.password && "1px solid red" }}
                  onChange={(e) => updateForm(e)}
                />
                <FormError message={errors.password} />
              </FloatingLabel>

              <Button className="w-100 mb-3" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center">Create an account with us <Link to="/signup">here</Link> if you don't have one.</p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
