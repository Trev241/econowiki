import React, { useCallback, useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import Spinner from "../components/Spinner";
import { cAxios, UserType } from "../constants";
import EditableList, { flags } from "../components/EditableList";

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [countries, setCountries] = useState();
  const [indicators, setIndicators] = useState();
  const [country, setCountry] = useState();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let response;

        // Save indicator data and map them to their ID
        response = await cAxios.get(`/indicator`);
        const _indicators = {};
        response.data.forEach((indicator) => {
          _indicators[indicator.id] = indicator;
        });
        setIndicators(_indicators);

        response = await cAxios.get(`/country`);
        setCountries(response.data);

        // Fetch country
        response = await cAxios.get(`/country/${searchParams.get("country")}`);
        setCountry(response.data);

        // Fetch values of country
        response = await cAxios.get(`/value/${searchParams.get("country")}`);

        // Arrange data by years
        const dataByYears = {};
        Object.keys(response.data).forEach((indicator) => {
          const entries = response.data[indicator].data;
          Object.keys(entries).forEach((year) => {
            // Create object if encountering current year for the first time
            if (!dataByYears[year]) dataByYears[year] = {};

            // Assign value and record id 
            dataByYears[year][indicator] = {
              id: entries[year].value_id,
              value: entries[year].value
            };
          });
        });

        // Convert into list for future components to consume
        const _formattedData = Object.keys(dataByYears).map((year) => {
          const entry = { year: year };
          Object.keys(dataByYears[year]).forEach((indicator_short_name) => {
            entry[indicator_short_name] =
              dataByYears[year][indicator_short_name].value;
          });
          return entry;
        });

        setFormattedData(_formattedData);
        setValues(dataByYears);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [searchParams]);

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

  const handleSave = async (entries, deletedEntries) => {
    // First, save editions/additions to database
    for (let idx = 0; idx < entries.length; idx++) {
      // Ignore entries that have not been edited and created
      if (!entries[idx].edited && !entries[idx].added) continue;

      const ignoreProps = new Set(flags).add("year");
      const props = Object.keys(entries[idx]).filter(
        (key) => !ignoreProps.has(key)
      );

      for (const prop of props) {
        let api_endpoint = "http://localhost:5001/value/";
        let method;

        const row = values[entries[idx].year];
        const old = row ? row[prop] : undefined;

        if (entries[idx][prop] && !isNumeric(entries[idx][prop])) 
          throw new Error(`Failed to save changes. Received invalid input in row ${idx + 1} under column name ${prop}`);

        try {
          if (old === undefined && entries[idx][prop]) {
            // Value previously did not exist but was now created
            api_endpoint += "add";
            method = "POST";
          } else if (old && !entries[idx][prop]) {
            // Value no longer exists
            api_endpoint += old.id;
            method = "DELETE";
          } else if (old.value !== entries[idx][prop]) {
            // Value was edited
            api_endpoint += `update/${old.id}`;
            method = "PUT";
          } else continue;

          await fetch(api_endpoint, {
            method: method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country_id: country.id,
              indicator_id: Object.values(indicators).find(
                (indicator) => indicator.short_name === prop
              )?.id,
              year: entries[idx].year,
              value: entries[idx][prop],
            }),
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    // Commit row deletions to database
    for (const deletedEntry of deletedEntries)
      for (const old of Object.values(values[deletedEntry.year]))
        try {
          await fetch(`http://localhost:5001/value/${old.id}`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (err) {
          console.error(err);
        }

    // TODO: Should be possible to edit years as well

    return true;
  };

  const isNumeric = useCallback((str) => {
    if (typeof str === "number") return true;
    if (typeof str === "string")
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ); // ...and ensure strings of whitespace fail
  }, []);

  if (!values || !countries || !indicators || !country) {
    return <Spinner />;
  }

  return (
    <Container fluid className="px-3">
      <div className="my-5">
        <h4 className="mb-3 text-center">
          <MdOutlineFeaturedPlayList className="mb-2" />
          &nbsp;Values
        </h4>
        <Form.Group
          as={Row}
          className="mb-3 d-flex flex-column"
          controlId="country"
        >
          <Col sm={6} className="mx-auto">
            <Form.Select
              value={searchParams.get("country")}
              onChange={updateCountryFilter}
            >
              <option>-Select a country-</option>
              {countries.map((country) => (
                <option
                  value={country.iso_alpha_3_code}
                  key={country.iso_alpha_3_code}
                >
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
      </div>

      <EditableList
        data={formattedData}
        setData={setFormattedData}
        defaultEntry={{
          year: "",
          ...Object.values(indicators)
            .map((indicator) => indicator.short_name)
            .reduce((a, v) => ({ ...a, [v]: "" }), {}),
        }}
        entryPropNames={[
          "Year",
          ...Object.keys(indicators).map((id) => indicators[id].short_name),
        ]}
        onSave={handleSave}
      />
    </Container>
  );
}
