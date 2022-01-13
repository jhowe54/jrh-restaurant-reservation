import React from "react";


function TableDisplay({ tables }) {
    const allTables = tables.map((table) => {
        return (
            <div key={table.table_id}>
                <h6>{table.table_name} - Table Id: {table.table_id}</h6>
                <p data-table-id-status={table.table_id}>{table.reservation_id ? 'Occupied' : 'Free'} </p>
            </div>
        )
    })

    return (
        <>
        {allTables}
        </>
    )
}


export default TableDisplay