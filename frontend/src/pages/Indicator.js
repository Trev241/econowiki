import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineLineChart } from "react-icons/ai";
import EditableList from "../components/EditableList";

export default function Indicator() {
  const [indicators, setIndicators] = useState();
  
  useEffect(() => {
    (async () => {
      try {
        let response;
        
        response = await fetch(`http://localhost:5001/indicator`, {
          credentials: 'include'
        })
        const _indicators = await response.json();
        setIndicators(_indicators);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [])

  const handleSave = async (entries, deletedEntries) => {
    // Save changes to database
    for (let index = 0; index < entries.length; index++) {
      // Choose API endpoint and method. If the entry was neither edited nor was it an addition then ignore
      let api_endpoint = "http://localhost:5001/indicator/";
      let method;

      if (entries[index].edited) {
        api_endpoint += `update/${entries[index].id}`;
        method = "PUT";
      } else if (entries[index].added) {
        api_endpoint += `add`;
        method = "POST";
      } else 
        continue;
      
      try {
        // Make API request
        await fetch(api_endpoint, {
          method: method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entries[index])
        })
      } catch (err) {
        console.error(err);
      }
    }

    // Commit deletions to database
    for (let index = 0; index < deletedEntries.length; index++) {
      try {
        await fetch(`http://localhost:5001/indicator/${deletedEntries[index].id}`, {
          method: "DELETE",
          credentials: "include"
        })
      } catch (err) {
        console.error(err);
      }
    }

    window.location.reload();
  }

  return (
    indicators && (
      <Container fluid className="my-5 px-3">
        <h1 className="mb-3">
          <AiOutlineLineChart className="mb-2" />
          &nbsp;Economic Indicators
        </h1>
        <p className="lead mb-5">A comprehensive list of all economic indicators used on this site accompanied by a short description.</p>

        <EditableList 
          data={indicators} 
          defaultEntry={{
            name: "",
            short_name: "",
            description: ""
          }} 
          entryPropNames={[
            "Name", "Code", "Description"
          ]}
          onSave={handleSave}
        />
      </Container>
    )
  )
}