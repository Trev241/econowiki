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

// import Offcanvas from 'react-bootstrap/Offcanvas';

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams();

  // API
  const [values, setValues] = useState([]);
  const [countries, setCountries] = useState();
  const [indicators, setIndicators] = useState();
  const [changes, setChanges] = useState({});
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
        const response = await axios.get(
          `http://localhost:5001/value/${searchParams.get("country")}`
        );
        const values = response.data.filter(
          (v) => v.indicator_id === +searchParams.get("indicator")
        );
        setValues(values);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [searchParams]);

  useIsAuth();

  const updateCountryFilter = (e) => {
    searchParams.set("country", e.target.value);
    setSearchParams(searchParams);
  };

  const updateIndicatorFilter = (e) => {
    searchParams.set("indicator", e.target.value);
    setSearchParams(searchParams);
  };

  const updateValues = (e, idx) => {
    // Setting UI state
    const newValues = [...values];
    newValues[idx].value = e.target.value;

    // Caching changes to be made as id-entry pair
    const change = {
      country_id: newValues[idx].country_id,
      indicator_id: newValues[idx].indicator_id,
      year: newValues[idx].year,
      value: newValues[idx].value,
    };
    setChanges((prev) => {
      return { ...prev, [newValues[idx].id]: change };
    });
    setValues(newValues);
  };

  const discard = () => {
    setChanges({});
  };

  const isNumeric = (str) => {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  };

  const save = async () => {
    // Validate
    let invalid = false;
    Object.keys(changes).forEach((id) => {
      invalid = !isNumeric(changes[id].value) || invalid;
    });

    if (invalid) {
      alert("Failed to save changes. Unexpected value(s) encountered.");
      return;
    }

    try {
      Promise.all(
        Object.keys(changes).map((id) => {
          return axios.put(`http://localhost:5001/value/update/${id}`, {
            country_id: changes[id].country_id,
            indicator_id: changes[id].indicator_id,
            year: changes[id].year,
            value: changes[id].value,
          });
        })
      ).then(() => {
        setAlert({
          message: `<span>Successfully updated the <b>${
            indicators.find((i) => i.id === searchParams.get("indicator") - 1)
              .short_name
          } (${Object.values(changes)
            .map((c) => c.year)
            .join(", ")}) </b> value${
            Object.keys(changes).length > 1 ? "s" : ""
          } for <b>${searchParams.get("country")}</b>!</span>`,
          status: "success",
        });
        setChanges({});
      });
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
    <Container className="mb-3">
      {alert.message && (
        <Alert
          variant={alert.status}
          dismissible
          onClose={() =>
            setAlert({
              message: "",
              status: "",
            })
          }
        >
          {HTMLParser(alert.message)}
        </Alert>
      )}
      <Form className="border rounded p-4 my-5">
        <h4 className="mb-5">
          <BsFilter /> Filter
        </h4>
        <Form.Group as={Row} className="mb-3" controlId="country">
          <Form.Label column sm={2}>
            Country
          </Form.Label>
          <Col>
            <Form.Select
              value={searchParams.get("country")}
              onChange={updateCountryFilter}
            >
              <option>-Select a country-</option>
              {countries.map((country, i) => (
                <option value={country.iso_alpha_3_code} key={i}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Economic Indicator
          </Form.Label>
          <Col>
            <Form.Select
              value={searchParams.get("indicator")}
              onChange={updateIndicatorFilter}
            >
              <option>-Select an economic indicator-</option>
              {indicators.map((indicator) => (
                <option value={indicator.id} key={indicator.id}>
                  {indicator.name} ({indicator.short_name})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
      </Form>

      {/* {Object.keys(changes).length > 0 && (
        <Alert key="warning" variant="warning">
          <div className="d-flex align-items-center">
            <span>You have unsaved changes!</span>
            <Button className="ms-auto" variant="success" onClick={save}>
              Save
            </Button>
          </div>
        </Alert>
      )} */}

      <Container className="mb-3">
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <h2>Values</h2>
          <div className="d-flex align-items-center">
            {Object.keys(changes).length > 0 && (
              <Badge bg="danger" className="h-75 mx-4">
                <MdError /> &nbsp;You have unsaved changes!
              </Badge>
            )}
            <Button
              className="h-75"
              variant="outline-success"
              onClick={save}
              disabled={Object.keys(changes).length === 0}
            >
              <AiFillSave /> &nbsp;Save
            </Button>
            <Button
              className="ms-2 h-75"
              variant="outline-danger"
              onClick={discard}
              disabled={Object.keys(changes).length === 0}
            >
              <MdCancel /> &nbsp;Cancel
            </Button>
          </div>
        </div>
        {values.length > 0 ? (
          values.map((entry, idx) => (
            <Row className="mb-3 d-flex align-items-center" key={idx}>
              <Col sm={2} className="mb-2">
                {entry.year}
              </Col>
              <Col className="mb-2">
                <Form.Control
                  className="text-center"
                  type="text"
                  value={entry.value}
                  onChange={(e) => updateValues(e, idx)}
                />
              </Col>
              <Col sm={2}>
                <div className="d-flex">
                  <Button variant="outline-danger" className="ms-auto">
                    <AiFillDelete />
                  </Button>
                </div>
              </Col>
            </Row>
          ))
        ) : (
          <>No available data</>
        )}
      </Container>
    </Container>
  );
}
