import React, { useCallback, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FcCheckmark } from "react-icons/fc";
import Spinner from "react-bootstrap/Spinner";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import FormError from "../components/FormError";
import authService from "../services/AuthService";
import "./Auth.css";
import { GiWorld } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState();
  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showRegistered, setShowRegistered] = useState(false);

  const navigate = useNavigate();

  const updateForm = (e) => {
    const entry = { [e.target.name]: e.target.value };
    setForm({ ...form, ...entry });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const _errors = {};
      if (form.username.trim().length === 0)
        _errors.username = "Username must not be empty!";
      else if (!isNaN(form.username.trim()))
        _errors.username = "Username must have atleast 1 character!";
      if (
        !form.email
          .trim()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      )
        _errors.email = "The email address given is not valid!";
      if (form.password.trim().length < 8)
        _errors.password = "Password must contain at least 8 characters!";
      else if (form.password.trim() !== form.confirmPassword.trim())
        _errors.confirmPassword = "Passwords must match!";

      setErrors(_errors);

      if (JSON.stringify(_errors) === "{}") {
        setLoading(true);
        await authService.signup(
          form.username,
          form.email,
          form.password
        )
        .then(() => {
          setShowRegistered(true);
        })
        .catch(error => {
          console.error(error);
          setErrorMessage(error.response.data.message);
          setShowFailedAlert(true);
        });
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <div className="d-flex align-items-center container-image">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            {showRegistered ? (
              <div className="d-flex flex-column align-items-center bg-light p-5 rounded">
                <div className="text-center display-1 mb-3">
                  <FcCheckmark />
                  <h1 className="mb-4">Success!</h1>
                </div>
                <p className="lead mb-4">
                  Now all that's left is to wait for an administrator to approve your registration.
                  You will be notified of your approval on your registered email address ({form.email})
                </p>
                <p className="text-center">Until then, Happy Surfing!</p>
                <Button onClick={() => navigate("/")}>Return home</Button>
              </div>
            ) : (
              <Form
                onSubmit={handleSubmit}
                className="border rounded p-5 bg-light"
                style={{
                  borderColor: "rgb(180, 180, 180)",
                }}
              >
                <div className="text-center mb-5">
                  <GiWorld className="display-1 mb-2" />
                  <h1 className="display-6">Ready to join us?</h1>
                  <p className="lead">Create a new account</p>
                </div>

                <Alert show={showFailedAlert} className="mb-4" variant="danger">
                  {errorMessage}
                </Alert>

                <FloatingLabel 
                  controlId="username"
                  label="Username"
                  className="mb-2"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Example username"
                    value={form.username}
                    onChange={(e) => updateForm(e)}
                    style={{ border: errors.username && "1px solid red" }}
                  />
                  <FormError message={errors.username} />
                </FloatingLabel>

                <FloatingLabel 
                  controlId="email"
                  label="Email address"
                  className="mb-2"
                >
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={(e) => updateForm(e)}
                    style={{ border: errors.email && "1px solid red" }}
                  />
                  <FormError message={errors.email} />
                </FloatingLabel>
                
                <FloatingLabel 
                  controlId="password"
                  label="Password"
                  className="mb-2"
                >
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Example password"
                    value={form.password}
                    onChange={(e) => updateForm(e)}
                    style={{ border: errors.password && "1px solid red" }}
                  />
                  <FormError message={errors.password} />
                </FloatingLabel>
                
                <FloatingLabel 
                  controlId="confirmPassword"
                  label="Confirm password"
                  className="mb-4"
                >
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm(e)}
                    style={{ border: errors.confirmPassword && "1px solid red" }}
                  />
                  <FormError message={errors.confirmPassword} />
                </FloatingLabel>

                <Button className="w-100 mb-3" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" variant="light" size="sm" />
                  ) : (
                    "Sign up"
                  )}
                </Button>

                <p className="text-center">Already registered? Login <Link to="/login">here</Link>.</p>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
