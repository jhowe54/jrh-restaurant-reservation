import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert"


function TableForm({handleChange, handleSubmit, formData, createTableError}) {
    const history = useHistory();
    
    return (
        <>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Create a New Table</legend>
              <ErrorAlert error={createTableError} />
              <div className="item">
                <label htmlFor="table_name">Table Name</label>
                <input
                  name="table_name"
                  id="table_name"
                  onChange={handleChange}
                  type="text"
                  required
                  value={formData.table_name}
                />
              </div>
              <div className="item">
                <label htmlFor="capacity">Capacity:</label>
                <input
                  id="capacity"
                  onChange={handleChange}
                  type="number"
                  name="capacity"
                  required
                  value={formData.capacity}
                />
              </div>
            </fieldset>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => history.goBack()}>
              Cancel
            </button>
          </form>
        </>
      );
}

export default TableForm;