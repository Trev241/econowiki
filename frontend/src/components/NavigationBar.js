import React from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"

export default function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">World Income</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">About</Nav.Link>
          </Nav>
          <Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
  </Navbar>
  )
}