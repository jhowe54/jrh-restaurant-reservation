import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";

function TableForm({ handleChange, handleSubmit, formData, createTableError }) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <fieldset>
        <legend className="form-item">Create a New Table</legend>
        <ErrorAlert error={createTableError} />
        <div className="form-item">
          <label htmlFor="table_name">Table Name</label>
          <input
            className="form-input"
            name="table_name"
            id="table_name"
            onChange={handleChange}
            type="text"
            required
            value={formData.table_name}
          />
        </div>
        <div className="form-item">
          <label htmlFor="capacity">Capacity:</label>
          <input
            className="form-input"
            id="capacity"
            onChange={handleChange}
            type="number"
            name="capacity"
            required
            min={1}
            value={formData.capacity}
          />
        </div>
      </fieldset>
      <div className="form-item mt-2 mb-2">
        <button type="submit" className="btn btn-success form-button">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary form-button"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TableForm;
