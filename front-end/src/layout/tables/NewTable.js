import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";

import TableForm from "./TableForm"
function NewTable() {
    const history = useHistory();
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    const [formData, setFormData] = useState(initialFormState);
    const [createTableError, setCreateTableError] = useState(false);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCreateTableError(null);
        formData.capacity = Number(formData.capacity);
    
        try {
          await createTable(formData);
          setFormData(initialFormState);
          history.push('/dashboard');
        } catch (error) {
          setCreateTableError(error);
        }
      };
    
      const handleChange = (event) => {
        event.preventDefault();
        setCreateTableError("");
        setFormData((newTable) => ({
          ...newTable,
          [event.target.name]: event.target.value,
        }));
      };
    
      return (
        <div className="form-container">
          <h1> Create New Table</h1>
          <TableForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={formData}
            createTableError={createTableError}
          />
        </div>
      );
}

export default NewTable