import axios from "axios";
import HTMLParser from "html-react-parser";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MdCancel, MdError } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useIsAuth } from "../hooks/useIsAuth";

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams();

  // From API
  const [values, setValues] = useState([]);
  const [oldValues, setOldValues] = useState([])
  const [countries, setCountries] = useState();
  const [indicators, setIndicators] = useState();
  const [country, setCountry] = useState()

  const [showUnsaved, setShowUnsaved] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    status: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let response;

        response = await axios.get(`http://localhost:5001/indicator`);
        setIndicators(response.data);

        response = await axios.get(`http://localhost:5001/country`);
        setCountries(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let response

        // Fetch country
        response = await fetch(`http://localhost:5001/country/${searchParams.get("country")}`)
        setCountry(await response.json())

        // Fetch values of country
        response = await fetch(`http://localhost:5001/value/${searchParams.get("country")}`)
        const results = await response.json()

        // Filter indicator
        let rows = []
        results.forEach((entry) => {
          if (entry.indicator_id === +searchParams.get("indicator"))
            rows.push(entry)
        })
        
        // Create copy in case reset is necessary
        setValues(rows)
        setOldValues(rows.map(row => { return { ...row } }))
        setShowUnsaved(false)
      } catch (error) {
        console.error(error);
      }
    }

    fetchData()
  }, [searchParams, countries, indicators])

  const updateCountryFilter = (e) => {
    searchParams.set("country", e.target.value);
    setSearchParams(searchParams);
  };

  const updateIndicatorFilter = (e) => {
    searchParams.set("indicator", e.target.value);
    setSearchParams(searchParams);
  };

  const getBorderStyle = (entry) => {
    let style = "border border-4 rounded p-3 "

    if (entry.addition)
      style += "border-success"
    else if (entry.delete)
      style += "border-danger"
    else if (entry.edited)
      style += "border-warning"
    else
      style = ""

    return style
  }

  const edit = (e, idx) => {
    let newValues = [...values]
    newValues[idx][e.target.name] = e.target.value
    newValues[idx].edited = !newValues[idx].addition && true

    setValues(newValues)
    setShowUnsaved(true)
  }

  const add = () => {
    setValues(prev => (
      [...prev, {
        id: prev.length + 1,
        country_id: country.id,
        indicator_id: searchParams.get("indicator"),
        year: "",
        value: "",
        addition: true
      }]
    ))
    setShowUnsaved(true)
  }

  const remove = async () => {
    try {
      values.forEach(async (entry) => {
        if (!entry.selected)
          return
          
        await fetch(`http://localhost:5001/value/${entry.id}`, {
          method: "DELETE"
        })
        .then(response => {
          if (!response.ok) throw new Error(response.status)
          else return response.json()
        })
        .then(response => {
          alert("Deleted entries successfully")
          window.location.reload()
        })
        .catch(error => {
          alert(`An error occurred. ${error}`)
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const select = (e, idx) => {
    let newValues = [...values]
    newValues[idx].selected = e.target.checked

    setValues(newValues)
  }

  const discard = () => {
    setValues(oldValues.map(oldValue => { return {...oldValue} }))
    setShowUnsaved(false)
  }

  const isNumeric = (str) => {
    if (typeof str === "number") 
      return true

    if (typeof str === "string")
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  const save = async () => {
    // Validate values before making call to API
    let invalid = false
    values.forEach((entry) => {
      invalid = !isNumeric(entry.value) || !isNumeric(entry.year) || invalid
    })

    if (invalid) {
      alert("Failed to save changes. Unexpected value(s) encountered.");
      return;
    }

    try {
      values.forEach(async (entry) => {
        let api_endpoint, method
        
        if (entry.edited) {
          api_endpoint = `http://localhost:5001/value/update/${entry.id}`
          method = "PUT"
        } else if (entry.addition) {
          api_endpoint = "http://localhost:5001/value/add"
          method = "POST"
        } else return

          // PUT edits
        await fetch(api_endpoint, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country_id: entry.country_id,
            indicator_id: entry.indicator_id,
            year: entry.year,
            value: entry.value
          })
        })
        .then((response) => {
          if (!response.ok) throw new Error(response.status)
          else return response.json()
        })
        .then((response) => {
          alert("Changes successfully saved!")
          window.location.reload()
        })
        .catch((error) => {
          alert(`An error occurred. ${error}`)
        })
      })
    } catch (error) {
      console.error(error);
      setAlert({
        message: "Some error has occured, please try again later!",
        status: "danger",
      });
    }
  };

  if (!values || !countries || !indicators) {
    return <Spinner />;
  }

  return (
    values && oldValues && countries && indicators && country && <>
      <Container className="mb-3">
        <div className="border rounded p-4 my-5">
          <h1 className="mb-3">Choose a country and a category</h1>
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
        </div>

        {showUnsaved && 
          <Alert className="my-5" key="warning" variant="warning">
            <div className="d-flex align-items-center">
              <span>You have <b>unsaved changes</b>! Remember to save your changes before leaving this page.</span>
              <Button className="ms-auto" variant="success" onClick={save}>Save</Button>
            </div>
          </Alert>
        }

        <Container className="mb-3">
          <h1 className="mb-3">Values</h1>
          
          <Row className="mb-5">
            <Col md={3}>
              <Button
                className="w-100 mb-2"
                onClick={add}
              >
                Create entry
              </Button>
            </Col>

            <Col md={4}>
              <Button
                className="w-100 mb-2"
                variant="danger"
                onClick={remove}
              >
                Delete selected entries
              </Button>
            </Col>

            <Col md={3}>
              <Button 
                className="w-100 mb-2" 
                variant="success" 
                onClick={save}
                disabled={!showUnsaved}
              >
                Save Changes
              </Button>
            </Col>

            <Col>
              <Button 
                className="w-100" 
                variant="secondary"
                onClick={discard}
                disabled={!showUnsaved}
              >
                Discard
              </Button>
            </Col>
          </Row>

          {/* <hr className="mb-5" /> */}
          
          {values.length > 0 ? ( values.map((entry, idx) => (
            <Row className={`mb-3 ${getBorderStyle(entry)}`}>
              <Col xs={1}>
                <div className="d-flex align-items-center" style={{ minHeight: "75%" }}>
                  <Form.Check 
                    type="checkbox"
                    onChange={(e) => select(e, idx)}
                  />
                </div>
              </Col>
              <Col xs={3} className="mb-2">
                <Form.Control
                  type="number"
                  min="1000"
                  max="3000"
                  step="1"
                  name="year"
                  value={entry.year}
                  onChange={(e) => edit(e, idx)}
                />
              </Col>
              <Col className="mb-2">
                <Form.Control
                  className="text-center"
                  type="text"
                  name="value"
                  value={entry.value}
                  onChange={(e) => edit(e, idx)}
                />
              </Col>
            </Row>
          ))) : (
            <>No available data</>
          )}
        </Container>
      </Container>
    </Container>
  );
}
