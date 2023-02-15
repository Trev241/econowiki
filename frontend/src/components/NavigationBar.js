import React from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function NavigationBar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to={"/"} className="text-decoration-none text-white">
            World Income
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {!isAuthenticated ? (
              <Button
                variant="outline-secondary"
                onClick={() => loginWithRedirect()}
                size="sm"
              >
                Login
              </Button>
            ) : (
              <Nav.Link>
                <img
                  src={user.picture}
                  alt={"User-Avatar"}
                  referrerPolicy="no-referrer"
                  className="p-1 rounded-circle"
                  style={{
                    border: "1px solid rgb(100, 100, 100)",
                    width: "50px",
                    heigth: "50px",
                  }}
                />
                <span style={{ fontSize: "0.8rem" }}>
                  &nbsp;&nbsp;{user.name}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  size="sm"
                >
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
