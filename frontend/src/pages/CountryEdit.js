// import HTMLParser from "html-react-parser";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// import Alert from "react-bootstrap/Alert";
// import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import { AiFillDelete, AiFillSave } from "react-icons/ai";
// import { BsFilter } from "react-icons/bs";
import { MdCancel, MdError, MdOutlineFeaturedPlayList } from "react-icons/md";
// import { FaCheck } from "react-icons/fa";
// import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { cAxios, modYears, UserType } from "../constants";
// import { TbMoodEmpty } from "react-icons/tb";
import { AuthContext } from "../components/AuthProvider";
import EditableList, { flags } from "./EditableList";

export default function CountryEdit() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
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
    (async () => {
      try {
        let response;

        // Save indicator data and map them to their ID
        response = await cAxios.get(`/indicator`);
        const _indicators = {};
        response.data.forEach(indicator => {
          _indicators[indicator.id] = indicator
        })
        setIndicators(_indicators);

        response = await cAxios.get(`/country`);
        if (response.data.status === 200)
          setCountries(response.data.countries);
      } catch (error) {
        showError(error);
      }
    })();
  }, [showError]);

  useEffect(() => {
    (async () => {
      try {
        let response;

        // Fetch country
        response = await cAxios.get(`/country/${searchParams.get("country")}`);
        if (response.data.status) {
          setCountry(response.data.country);
        }

        // Fetch values of country
        response = await cAxios.get(`/value/${searchParams.get("country")}`);
        
        // Group data into years
        const dataByYears = {};
        response.data.forEach(entry => {
          if (!dataByYears[entry.year])
            dataByYears[entry.year] = {}
          
          // TODO: Change dependency behaviour - indicators is sometimes undefined
          dataByYears[entry.year][indicators[entry.indicator_id].short_name] = {
            value: entry.value,
            id: entry.id
          };
        })

        // Convert into list for future components to consume
        const _formattedData = Object.keys(dataByYears).map(year => {
          const entry = { year: year };
          Object.keys(dataByYears[year]).forEach(indicator_short_name => {
            entry[indicator_short_name] = dataByYears[year][indicator_short_name].value;
          });
          return entry;
        })

        setFormattedData(_formattedData);
        setValues(dataByYears);
        setShowUnsaved(false);
      } catch (error) {
        showError(error);
      }
    })();
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

  const handleSave = async (entries, deletedEntries) => {
    // First, save editions/additions to database
    for (let idx = 0; idx < entries.length; idx++) {
      // Ignore entries that have not been edited and created
      if (!entries[idx].edited && !entries[idx].added)
        continue;
      
      const ignoreProps = new Set(flags).add("year");
      const props = Object.keys(entries[idx]).filter(key => !ignoreProps.has(key));
      
      for (const prop of props) {
        let api_endpoint = "http://localhost:5001/value/";
        let method;

        const row = values[entries[idx].year];
        const old = row ? row[prop] : undefined;

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
            api_endpoint += `update/${old.id}`
            method = "PUT";
          } else
            continue;

          await fetch(api_endpoint, {
            method: method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country_id: country.id,
              indicator_id: Object.values(indicators).find(indicator => indicator.short_name === prop)?.id,
              year: entries[idx].year,
              value: entries[idx][prop]
            })
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
            credentials: "include"
          });
        } catch (err) {
          console.error(err);
        }

    // TODO: Should be possible to edit years as well

    window.location.reload();
  }

  // const isNumeric = useCallback((str) => {
  //   if (typeof str === "number") return true;

  //   if (typeof str === "string")
  //     return (
  //       !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  //       !isNaN(parseFloat(str))
  //     ); // ...and ensure strings of whitespace fail
  // }, []);

  const isModerator = useMemo(() => user.type === UserType.MODERATOR, [user]);
  
  if (!values || !countries || !indicators || !country) {
    return <Spinner />;
  }

  return (
    <Container fluid className="my-5 px-3">
      <div className="mb-5">
        <h1 className="mb-3">
          <MdOutlineFeaturedPlayList className="mb-2" />
          &nbsp;Values
        </h1>
        <p className="lead mb-3">Select a country below to view all of its related records.</p>
      
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
      </div>


      <EditableList 
        data={formattedData}  
        defaultEntry={{
          year: "",
          ...Object.values(indicators)
            .map(indicator => indicator.short_name)
            .reduce((a, v) => ({ ...a, [v]: ""}), {})
        }}
        entryPropNames={[
          "Year", ...Object.keys(indicators).map(id => indicators[id].short_name)
        ]}
        onSave={handleSave}
      />
    </Container>
  );
}
