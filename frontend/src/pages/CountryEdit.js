import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// import Offcanvas from 'react-bootstrap/Offcanvas';

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams()

  // API
  const [values, setValues] = useState([])
  const [countries, setCountries] = useState()
  const [indicators, setIndicators] = useState()
  const [changes, setChanges] = useState({})

  useEffect(() => {
    async function fetchData() {
      try {
        let response
        
        response = await fetch(`http://localhost:5001/indicator`) 
        setIndicators(await response.json())
        
        response = await fetch(`http://localhost:5001/country`)
        setCountries(await response.json())
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch values of country
        const response = await fetch(`http://localhost:5001/value/${searchParams.get("country")}`)
        const results = await response.json()

        // Filter indicator
        let rows = []
        results.forEach((entry) => {
          if (entry.indicator_id === +searchParams.get("indicator"))
            rows.push(entry)
        })        

        setValues(rows)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [searchParams])

  const updateCountryFilter = (e) => {
    searchParams.set("country", e.target.value)
    setSearchParams(searchParams)
  }

  const updateIndicatorFilter = (e) => {
    searchParams.set("indicator", e.target.value)
    setSearchParams(searchParams)
  } 

  const updateValues = (e, idx) => {
    // Setting UI state
    const newValues = [...values]
    newValues[idx].value = e.target.value
    
    // Caching changes to be made as id-entry pair
    const change = { 
      [newValues[idx].id]: {
        country_id: newValues[idx].country_id,
        indicator_id: newValues[idx].indicator_id,
        year: newValues[idx].year,
        value: newValues[idx].value
      }
    }
    setChanges((prev) => {
      return {...prev, ...change}
    })
    setValues(newValues)
  }

  const discard = () => {
    setChanges({})
  }

  const isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  const save = async () => {
    // Validate
    let invalid = false
    Object.keys(changes).forEach((id) => {
      invalid = !isNumeric(changes[id].value) || invalid
    })

    if (invalid) {
      alert("Failed to save changes. Unexpected value(s) encountered.")
      return
    } 

    try {
      Object.keys(changes).forEach(async (id) => {
        await fetch(`http://localhost:5001/value/update/${id}`, {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            country_id: changes[id].country_id,
            indicator_id: changes[id].indicator_id,
            year: changes[id].year,
            value: changes[id].value
          })
        })
        .then((response) => {
          if (!response.ok) throw new Error(response.status)
          else return response.json()
        })
        .then((response) => {
          alert("Changes successfully saved!")
        })
        .catch((error) => {
          alert(`An error occurred. ${error}`)
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    values && countries && indicators && <>
      <Container className="mb-3">
        <Form className="border rounded p-4 my-5">
          <h1 className="mb-3">Choose a filter</h1>
          <Form.Group as={Row} className="mb-3" controlId="country">
            <Form.Label column sm={2}>Country</Form.Label>
            <Col>
              <Form.Select
                value={searchParams.get("country")}
                onChange={updateCountryFilter}
              >
                <option>-Select a country-</option>
                {countries.map((country) => <option value={country.iso_alpha_3_code}>{country.name}</option>)}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Economic Indicator</Form.Label>
            <Col>
              <Form.Select
                value={searchParams.get("indicator")}
                onChange={updateIndicatorFilter}
              >
                <option>-Select an economic indicator-</option>
                {indicators.map((indicator) => <option value={indicator.id}>{indicator.name} ({indicator.short_name})</option>)}
              </Form.Select>
            </Col>
          </Form.Group>
        </Form>

        {Object.keys(changes).length > 0 && 
          <Alert key="warning" variant="warning">
            <div className="d-flex align-items-center">
              <span>You have unsaved changes!</span>
              <Button className="ms-auto" variant="success" onClick={save}>Save</Button>
            </div>
          </Alert>
        }

        <Container className="mb-3">
          <h1 className="mb-3">Values</h1>
          {/* <hr className="mb-3" /> */}
          <p className="lead mb-5">Remove entries using the delete button or edit existing values using the input fields below.</p>
          {values.length > 0 ? ( values.map((entry, idx) => (
            <Row className="mb-3">
              <Col sm={2} className="mb-2">{entry.year}</Col>
              <Col className="mb-2">
                <Form.Control 
                  className="text-end"
                  type="text"
                  value={entry.value}
                  onChange={(e) => updateValues(e, idx)}
                />
              </Col>
              <Col sm={2}>
                <div className="d-flex">
                  <Button className="ms-auto" variant="danger">
                    Delete
                  </Button>
                </div>
              </Col>
            </Row>
          ))) : (
            <>No available data</>
          )}

          <div className="d-flex mt-5">
            <Button 
              className="ms-auto" 
              variant="success" 
              onClick={save} 
              disabled={Object.keys(changes).length === 0}
            >
              Save Changes
            </Button>
            <Button 
              className="ms-2" 
              variant="secondary"
              onClick={discard}
              disabled={Object.keys(changes).length === 0}
            >
              Discard
            </Button>
          </div>
        </Container>
      </Container>
    </>
  )
}