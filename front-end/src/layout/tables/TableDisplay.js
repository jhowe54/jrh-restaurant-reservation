import React from "react";

function TableDisplay({ tables, handleClear }) {
  const allTables = tables.map((table) => {
    return (
      <div key={table.table_id}>
        <h6>
          {table.table_name} - Id: {table.table_id}
        </h6>
        <p data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}{" "}
        </p>
        <button data-table-id-finish={table.table_id} onClick={() => handleClear(table)}>Finish</button>
      </div>
    );
  });

  return <>{allTables}</>;
}

export default TableDisplay;
