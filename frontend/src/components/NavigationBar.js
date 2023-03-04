import React, { useCallback, useContext } from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { GiWorld } from "react-icons/gi";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

export default function NavigationBar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    axios
      .post("http://localhost:5001/auth/logout", undefined, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/");
          setUser(null);
        }
      });
  }, [navigate, setUser]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to={"/"} className="text-decoration-none text-white">
            <GiWorld size={"50px"} /> &nbsp;World Income
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {!user ? (
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/login")}
                size="sm"
              >
                Login
              </Button>
            ) : (
              <Nav.Link>
                {/* <img
                  src={user.picture}
                  alt={"User-Avatar"}
                  referrerPolicy="no-referrer"
                  className="p-1 rounded-circle"
                  style={{
                    border: "1px solid rgb(100, 100, 100)",
                    width: "50px",
                    heigth: "50px",
                  }}
                /> */}
                <span style={{ fontSize: "0.8rem" }}>
                  &nbsp;&nbsp;@{user.username}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <Button variant="outline-secondary" onClick={logout} size="sm">
                  Logout
                </Button>
              </Nav.Link>
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
