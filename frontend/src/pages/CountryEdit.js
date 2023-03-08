import HTMLParser from "html-react-parser";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MdCancel, MdError, MdOutlineFeaturedPlayList } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { cAxios, modYears, UserType } from "../constants";
import { TbMoodEmpty } from "react-icons/tb";
import { AuthContext } from "../components/AuthProvider";

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [countries, setCountries] = useState();
  const [indicators, setIndicators] = useState();
  const [country, setCountry] = useState();

  const [showUnsaved, setShowUnsaved] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    status: "",
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const showError = useCallback((error) => {
    setAlert({
      status: "danger",
      message: "Some error has occured, please try again in sometime!",
    });
    console.error(error);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let response;

        response = await cAxios.get(`/indicator`);
        setIndicators(response.data);

        response = await cAxios.get(`/country`);
        if (response.data.status === 200) {
          setCountries(response.data.countries);
        }
      } catch (error) {
        showError(error);
      }
    }

    fetchData();
  }, [showError]);

  useEffect(() => {
    async function fetchData() {
      try {
        let response;

        // Fetch country
        response = await cAxios.get(`/country/${searchParams.get("country")}`);
        if (response.data.status) {
          setCountry(response.data.country);
        }

        // Fetch values of country
        response = await cAxios.get(`/value/${searchParams.get("country")}`);
        const results = response.data;
        const filtered = results.filter(
          (entry) => entry.indicator_id === +searchParams.get("indicator")
        );

        // Create copy in case reset is necessary
        setValues(filtered);
        setOldValues([...results]);
        setShowUnsaved(false);
      } catch (error) {
        showError(error);
      }
    }

    fetchData();
  }, [searchParams, countries, indicators, showError]);

  useEffect(() => {
    if (user.type === UserType.MEMBER) {
      navigate("/");
    }
  }, [user, navigate]);

  const updateCountryFilter = useCallback(
    (e) => {
      searchParams.set("country", e.target.value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const updateIndicatorFilter = useCallback(
    (e) => {
      searchParams.set("indicator", e.target.value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const getBorderStyle = useCallback((entry) => {
    let style = "border border-2 rounded p-3 ";

    if (entry.addition) style += "border-success";
    else if (entry.delete) style += "border-danger";
    else if (entry.edited) style += "border-warning";
    else style = "";

    return style;
  }, []);

  const edit = useCallback(
    (e, idx) => {
      let newValues = [...values];
      newValues[idx][e.target.name] = e.target.value;
      newValues[idx].edited = !newValues[idx].addition;

      setValues(newValues);
      setShowUnsaved(true);
    },
    [values]
  );

  const add = useCallback(() => {
    setValues((prev) => [
      {
        id: prev.length + 1,
        country_id: country.id,
        indicator_id: searchParams.get("indicator"),
        year: "",
        value: "",
        addition: true,
      },
      ...prev,
    ]);
    setShowUnsaved(true);
  }, [country, searchParams]);

  const remove = async () => {
    let newValues = [];
    let years = [];

    try {
      for (const entry of values) {
        if (entry.selected) {
          if (!entry.addition) {
            await cAxios
              .delete(`/value/${entry.id}`)
              .then(() => years.push(entry.year))
              .catch(() => {
                setAlert({
                  status: "danger",
                  message:
                    "Some error has occured, please try again in sometime!",
                });
              });
          } else {
            newValues.push(entry);
          }
        }
      }
      setAlert({
        status: "success",
        message: `<span>All selected entries has been deleted successfully! <b>(${years.join(
          ","
        )})</b></span>`,
      });
      setValues(newValues);
    } catch (error) {
      showError(error);
    }
  };

  const select = useCallback(
    (e, idx) => {
      let newValues = [...values];
      newValues[idx].selected = e.target.checked;
      setValues(newValues);
    },
    [values]
  );

  const discard = useCallback(() => {
    setValues([...oldValues]);
    setShowUnsaved(false);
  }, [oldValues]);

  const isNumeric = useCallback((str) => {
    if (typeof str === "number") return true;

    if (typeof str === "string")
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ); // ...and ensure strings of whitespace fail
  }, []);

  const save = useCallback(async () => {
    // Validate values before making call to API
    let invalid = false;
    values.forEach((entry) => {
      invalid = !isNumeric(entry.value) || !isNumeric(entry.year) || invalid;
    });

    if (invalid) {
      setAlert({
        status: "danger",
        message: "Failed to save changes. Unexpected value(s) encountered.",
      });
      return;
    }

    try {
      for (const entry of values) {
        let api_endpoint, method;

        if (entry.edited) {
          api_endpoint = `http://localhost:5001/value/update/${entry.id}`;
          method = "PUT";
        } else if (entry.addition) {
          api_endpoint = "http://localhost:5001/value/add";
          method = "POST";
        } else return;

        await fetch(api_endpoint, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country_id: entry.country_id,
            indicator_id: entry.indicator_id,
            year: entry.year,
            value: entry.value,
          }),
        });
      }

      setAlert({
        status: "success",
        message: "Saved changes successfully!",
      });
      window.location.reload();
    } catch (error) {
      showError(error);
    }
  }, [isNumeric, showError, values]);

  const isModerator = useMemo(() => user.type === UserType.MODERATOR, [user]);

  if (!values || !countries || !indicators || !country || !oldValues) {
    return <Spinner />;
  }

  return (
    <>
      {alert.message && (
        <Container>
          <Alert dismissible variant={alert.status}>
            {alert.status === "success" ? <FaCheck /> : <MdError />}{" "}
            {HTMLParser(alert.message)}
          </Alert>
        </Container>
      )}
      <Container className="mb-3">
        <div className="border rounded p-4 my-5">
          <h4 className="mb-3">
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
                {countries.map((country) => (
                  <option value={country.iso_alpha_3_code}>
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
                  <option value={indicator.id}>
                    {indicator.name} ({indicator.short_name})
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </div>

        {showUnsaved && (
          <Alert className="my-5" key="warning" variant="warning">
            <div className="d-flex align-items-center">
              <span>
                You have <b>unsaved changes</b>! Remember to save your changes
                before leaving this page.
              </span>
              <Button className="ms-auto" variant="success" onClick={save}>
                Save
              </Button>
            </div>
          </Alert>
        )}

        <Container className="mb-3">
          <h4 className="mb-3">
            <MdOutlineFeaturedPlayList />
            &nbsp;Values
          </h4>

          <Row className="mb-5">
            <Col md={3}>
              <Button className="w-100 mb-2 text-white" onClick={add}>
                <IoIosAddCircleOutline /> Create
              </Button>
            </Col>

            <Col md={3}>
              <Button className="w-100 mb-2" variant="danger" onClick={remove}>
                <AiFillDelete /> Delete
              </Button>
            </Col>

            <Col md={3}>
              <Button
                className="w-100 mb-2"
                variant="success"
                onClick={save}
                disabled={!showUnsaved}
              >
                <AiFillSave /> Save
              </Button>
            </Col>

            <Col>
              <Button
                className="w-100"
                variant="secondary"
                onClick={discard}
                disabled={!showUnsaved}
              >
                <MdCancel /> Discard
              </Button>
            </Col>
          </Row>

          {values.length > 0 ? (
            values.map((entry, idx) => (
              <Row className={`mb-3 ${getBorderStyle(entry)}`} key={entry.id}>
                <Col xs={1}>
                  <div
                    className="d-flex align-items-center"
                    style={{ minHeight: "75%" }}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={entry.selected}
                      onChange={(e) => select(e, idx)}
                      disabled={isModerator && idx < values.length - modYears}
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
                    placeholder="Year"
                    value={entry.year}
                    onChange={(e) => edit(e, idx)}
                    disabled={isModerator && idx < values.length - modYears}
                  />
                </Col>
                <Col className="mb-2">
                  <Form.Control
                    className="text-center"
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={entry.value}
                    onChange={(e) => edit(e, idx)}
                    disabled={isModerator && idx < values.length - modYears}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <p className="h6 text-center">
              <TbMoodEmpty /> No data available!
            </p>
          )}
        </Container>
      </Container>
    </>
  );
}
