import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import "./Sidebar.css";

export default function Sidebar({ items }) {
  const [show, setShow] = useState(true);

  const handleWindowSizeChange = () => {
    if (window.innerWidth >= 576)
      setShow(true);
  }

  window.addEventListener('resize', handleWindowSizeChange);

  return (
    <div className={`${show ? "sidebar" : ""} pt-5 px-4`}>
      <Button 
        className="ms-auto w-100 mb-5 slider-toggle" 
        variant="outline-secondary"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide" : "Expand"}
      </Button>
      {show && (
        <>
          {/* <h3 className="mb-4">Quick navigate</h3> */}
          {Object.keys(items).map(name => (
            // <Link href={`/${page}#${items[name]}`}>{name}</Link>
            <p
              key={items[name]}
              className="sidebar-item"
              onClick={() => document.getElementById(items[name]).scrollIntoView({behavior: "smooth"})}
            >
              {name}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
