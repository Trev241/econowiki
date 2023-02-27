import React, { useContext, useState } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { AuthContext } from "../components/AuthProvider"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [showFailedAlert, setShowFailedAlert] = useState(false)
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const updateForm = (e) => {
    const entry = { [e.target.name]: e.target.value }
    setForm({ ...form, ...entry})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await login(form.username, form.password)
    if (result) 
      navigate("/")
    else
      setShowFailedAlert(true)
  }

  return (
    <div className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            <Form onSubmit={handleSubmit} className="border border-dark rounded p-5">
              <h1 className="mb-5">Login</h1>
              
              {showFailedAlert && (
                <Alert className="mb-4" variant="danger">
                  Failed to log in
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
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
  )
}