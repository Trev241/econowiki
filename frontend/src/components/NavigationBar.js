import React, { useCallback, useContext, useEffect, useRef } from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { GiWorld } from "react-icons/gi";
import { AuthContext } from "./AuthProvider";
import { cAxios } from "../constants";

export default function NavigationBar() {
  const { user, setUser, countries, setCountries, country, setCountry } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const selectRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const response = await cAxios.get("/country");
      if (response.data.status === 200) {
        setCountries(response.data.countries);
      }
    }

    fetchData();
  }, [setCountries]);

  const logout = useCallback(() => {
    cAxios.post("/auth/logout").then((res) => {
      if (res.data.status === 200) {
        navigate("/");
        setUser(null);
      }
    });
  }, [navigate, setUser]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link
          to={"/"}
          className="text-decoration-none text-white"
          style={{
            fontFamily: "monospace",
          }}
        >
          <GiWorld size={"50px"} /> World Income
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="d-flex align-items-center">
            <Form.Select
              className="bg-dark text-white h-25 mx-5"
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
              }}
              aria-label="Select a country"
              onChange={(e) => {
                setCountry(
                  countries.find((c) => c.iso_alpha_3_code === e.target.value)
                );
                navigate(`/${e.target.value}`);
              }}
              disabled={!user}
              ref={selectRef}
              value={country.iso_alpha_3_code}
            >
              {!country.iso_alpha_3_code && (
                <option>{">"} &nbsp;Select a country</option>
              )}
              {countries.map((c, i) => (
                <option key={i} value={c.iso_alpha_3_code} data-name={c.name}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
            {!user ? (
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/login")}
                size="sm"
              >
                Login
              </Button>
            ) : (
              <>
                <img
                  src="/noImg.webp"
                  alt={"User-Avatar"}
                  className="p-1 rounded-circle"
                  style={{
                    border: "1px solid rgb(100, 100, 100)",
                    width: "40px",
                    heigth: "40px",
                  }}
                />
                <span
                  style={{ fontSize: "0.8rem", color: "rgb(200, 200, 200)" }}
                >
                  &nbsp;&nbsp;@{user.username}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <Button variant="outline-secondary" onClick={logout} size="sm">
                  Logout
                </Button>
              </>
            )}
          </Nav>
          <Nav>
            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
