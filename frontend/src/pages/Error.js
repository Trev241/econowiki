import React from "react"
import { MdError } from "react-icons/md"

export default function Error({ code, heading, message }) {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <MdError style={{ fontSize: "10em" }} />&nbsp;&nbsp;
        <h1 className="display-1">Error {code}</h1>
        <p className="lead">
          <b>{heading}</b> - {message}
        </p>
      </div>
    </div>
  )
}