import React from "react";

function TableDisplay({ tables, handleClear }) {
  const allTables = tables.map((table) => {
    return (
      <div key={table.table_id} className="table-tile">
        <ul className="table-data-list">
          <li>
            Table: <span>{table.table_name}</span>
          </li>
          <li>
            Id: <span>{table.table_id}</span>
          </li>
          <li data-table-id-status={table.table_id}>
            Status: <span>{table.reservation_id ? "Occupied" : "Free"}</span>
          </li>
        </ul>
        <div className="table-button-container">
          <button
            className="btn btn-success"
            data-table-id-finish={table.table_id}
            onClick={() => handleClear(table)}
          >
            Finish
          </button>
        </div>
      </div>
    );
  });

  return <div className="tables-container">{allTables}</div>;
}

export default TableDisplay;
