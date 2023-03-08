import React, { useCallback, useContext, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { cAxios, UserType } from "../constants";
import { AuthContext } from "./AuthProvider";
import Logo from "./Logo";
import { HiLogout } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

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
        <Logo color={"white"} />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="d-flex align-items-center">
            <Form.Select
              className="bg-dark text-white h-25"
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                marginRight: "1rem",
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
              <>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/login")}
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/signup")}
                  size="sm"
                  className="m-2"
                >
                  SignUp
                </Button>
              </>
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
                  &nbsp;&nbsp;&nbsp;
                </span>
                <div style={{ marginLeft: "3rem" }} className="d-flex">
                  {user.type === UserType.ADMINISTRATOR && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate("/dashboard")}
                      className="mx-2"
                    >
                      <MdDashboard />
                    </Button>
                  )}
                  <Button
                    variant="outline-secondary"
                    onClick={logout}
                    size="sm"
                  >
                    <HiLogout />
                  </Button>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
