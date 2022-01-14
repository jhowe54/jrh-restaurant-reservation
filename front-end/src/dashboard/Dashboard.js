import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import { listReservations, listTables, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../layout/reservations/ReservationDisplay";
import TableDisplay from "../layout/tables/TableDisplay";

//test
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const query = useQuery();
  const dateQ = query.get("date");

  if (dateQ) {
    date = dateQ;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal).then(setTables);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  const handleClear = async (table) => {
    const abortController = new AbortController();

    try {
      if (window.confirm("Is this table ready to seat new guests?")) {
        await clearTable(table, abortController.signal);
        loadDashboard();
      }
      loadDashboard();
    } catch (err) {
      if (err.name !== "AbortError") {
        setReservationsError(err);
      }
      console.log("Abort");
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationDisplay reservations={reservations} />
      <TableDisplay tables={tables} handleClear={handleClear} />
    </main>
  );
}

export default Dashboard;
