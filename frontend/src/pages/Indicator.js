import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineLineChart } from "react-icons/ai";
import EditableList from "../components/EditableList";
import { UserType, cAxios } from "../constants";
import { AuthContext } from "../components/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Indicator() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [indicators, setIndicators] = useState();

  useEffect(() => {
    (async () => {
      try {
        const response = await cAxios.get("/indicator");
        setIndicators(response.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSave = async (entries, deletedEntries) => {
    // Save changes to database
    for (let index = 0; index < entries.length; index++) {
      // Choose API endpoint and method. If the entry was neither edited nor was it an addition then ignore
      let api_endpoint = "/indicator/";
      let method;

      if (entries[index].edited) {
        api_endpoint += `update/${entries[index].id}`;
        method = "PUT";
      } else if (entries[index].added) {
        api_endpoint += `add`;
        method = "POST";
      } else continue;

      try {
        // Make API request
        method === "PUT"
          ? await cAxios.put(api_endpoint, entries[index])
          : await cAxios.post(api_endpoint, entries[index]);
      } catch (err) {
        throw new Error(err.response.data.message);
      }
    }

    // Commit deletions to database
    for (let index = 0; index < deletedEntries.length; index++) {
      try {
        await cAxios.delete(
          `http://localhost:5001/indicator/${deletedEntries[index].id}`
        );
      } catch (err) {
        if (err.response.status === 400)
          throw new Error(err.response.data.message);
        console.error(err);
      }
    }

    return true;
  };

  useEffect(() => {
    if (user.type === UserType.MEMBER) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    indicators && (
      <Container fluid className="my-5 px-3">
        <div className="d-flex">
          <AiOutlineLineChart className="display-5" />
          &nbsp;&nbsp;
          <h1>Economic Indicators</h1>
        </div>
        <p className="lead mb-5">
          A comprehensive list of all economic indicators used on this site
          accompanied by a short description. All countries are measured using
          these very indicators.
        </p>

        <p className="text-end text-muted">
          <i>Records can be viewed on the <Link to="/values">Values</Link> page.</i>
        </p>
        <EditableList
          data={indicators}
          defaultEntry={{
            name: "",
            short_name: "",
            description: "",
          }}
          uneditableProps={new Set()}
          entryPropNames={["Name", "Code", "Description"]}
          onSave={handleSave}
        />
      </Container>
    )
  );
}
