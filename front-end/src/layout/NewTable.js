import React, {useEffect, useState} from "react";
import { listTables} from "../utils/api"

function NewTable() {
    const [tables, setTables] = useState([])

    
    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal).then(setTables);
        return () => abortController.abort()
    }, [])

  const tableRows = tables.map((table) => {
      return <p>{table.table_name}</p>
  })
  return <div>{tableRows}</div>
}

export default NewTable;