import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { GoCheck } from "react-icons/go";
import Alert from "react-bootstrap/Alert";
import { AiFillSave } from "react-icons/ai";
import { AuthContext } from "../components/AuthProvider";
import { UserType, modYears } from "../constants";
import { BiErrorCircle } from "react-icons/bi";
import Spinner from "react-bootstrap/Spinner";

export const flags = new Set(["edited", "added", "delete", "editable"]);
export default function EditableList({
  data,
  defaultEntry,
  entryPropNames,
  uneditableProps,
  onSave,
}) {
  const [entries, setEntries] = useState(data);
  const [deletedEntries, setDeletedEntries] = useState([]);

  const [error, setError] = useState('An unexpected error occurred.');
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user } = useContext(AuthContext);
  const isModerator = useMemo(() => user.type === UserType.MODERATOR, [user]);

  useEffect(() => {
    setEntries(data);
  }, [data]);

  /**
   * Create a new entry using the placholder object
   */
  const create = () => {
    setShowAlert(true);

    const newEntry = {
      ...defaultEntry,
      editable: true,
      added: true,
    };
    setEntries([...entries, newEntry]);
  };

  /**
   * Updates an entry by modifying the property specified by
   * the name attribute of the form component.
   * @param {*} e - The event object
   * @param {*} idx - The index of the item in the list
   */
  const update = (e, idx) => {
    setShowAlert(true);

    // Much faster than use setState() callback
    const newEntries = [...entries];
    newEntries[idx][e.target.name] = e.target.value;
    newEntries[idx].edited = !newEntries[idx].added;
    setEntries(newEntries);
  };

  /**
   * Visually deletes an entry. Note that the entries must still
   * be explicitly deleted later. These entries can be retrieved using
   * getDeletedEntries()
   * @param {*} id - The of the entry to be deleted
   */
  const remove = (id) => {
    setShowAlert(true);

    const newData = [];
    entries.forEach((entry, idx) => {
      if (id === idx) {
        if (!entry.added) setDeletedEntries([...deletedEntries, entry]);
      } else newData.push(entry);
    });
    setEntries(newData);
  };

  const toggleEditable = (idx) => {
    const _entries = [...entries];
    _entries[idx].editable = !_entries[idx].editable;
    setEntries(_entries);
  };

  const handleSave = async () => {
    setSaving(true);
    let result = false;

    try {
      result = await onSave(entries, deletedEntries);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  
    setShowError(!result);
    setShowAlert(!result);
    setSaving(false);

    if (result)
      window.location.reload();
  }

  return (
    <>
      <div>
        <Alert
          show={showError}
          variant="danger"
          dismissible
          onClose={() => setShowError(false)}
          className="d-flex align-items-center mb-3"
        >
          <BiErrorCircle /> &nbsp;&nbsp;&nbsp;{error}
        </Alert>

        <Alert
          show={showAlert}
          className="d-flex align-items-center mb-3"
          variant="warning"
        >
          <AiFillSave /> &nbsp;&nbsp;&nbsp;You have unsaved changes.&nbsp;
          {deletedEntries.length > 0 && (
            <div>
              <b>{deletedEntries.length} row(s)</b> will be{" "}
              <b>permanently deleted</b> once changes are saved.
            </div>
          )}
          <Button
            variant="outline-dark"
            className="ms-auto"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Spinner /> : "Save"}
          </Button>
        </Alert>
      </div>

      <Table striped hover responsive bordered className="mb-4">
        <thead>
          <tr className="">
            <th className="p-3">#</th>
            {entryPropNames.map((prop) => (
              <th key={prop} className="p-3">
                {prop}
              </th>
            ))}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry, idx) => (
              <tr
                key={idx}
                style={{
                  opacity:
                    isModerator && idx < entries.length - modYears && "0.5",
                }}
              >
                <td className="align-middle p-3">{idx + 1}</td>
                {Object.keys(defaultEntry)
                  .filter((key) => !flags.has(key))
                  .map((attr) => (
                    <td key={attr} className="align-middle p-3">
                      {entry.editable && (!uneditableProps.has(attr) || entry.added) ? (
                        <Form.Control
                          id={idx + attr}
                          name={attr}
                          type="text"
                          value={entry[attr]}
                          onChange={(e) => update(e, idx)}
                        />
                      ) : (
                        entry[attr]
                      )}
                    </td>
                  ))}
                <td className="align-middle">
                  <div className="d-flex justify-content-center">
                    <Button
                      variant={
                        entry.editable ? "outline-success" : "outline-dark"
                      }
                      onClick={() => toggleEditable(idx)}
                      disabled={isModerator && idx < entries.length - modYears}
                    >
                      {entry.editable ? <GoCheck /> : <MdEdit />}
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="ms-2"
                      onClick={() => remove(idx)}
                      disabled={isModerator && idx < entries.length - modYears}
                    >
                      <MdDelete />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={Object.keys(defaultEntry).length + 2}
                className="lead align-middle text-center p-3"
              >
                No entries to display.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Button className="px-5 py-2 mb-5" variant="primary" onClick={create} disabled={isModerator}>
          <RiAddCircleFill className="mb-1 me-2" />
          Add
        </Button>
      </div>
    </>
  );
}
