import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import "./Error.css"

export default function Error({ error }) {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="py-5 px-3 m-3">
          <Col xl={4}>
            <div className="d-flex align-items-center justify-content-end-lg px-4 mb-3" style= {{ minHeight: "100%" }}>
              <h1 className="display-1 mb-0">Error {error?.code}</h1>
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center px-4 mb-3" style={{ minHeight: "100%" }}>
              <div>
                <h1 className="display-6">{error?.heading || "Something went wrong..."}</h1>
                <p className="lead mb-0">{error?.message || "Please try again later."}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}