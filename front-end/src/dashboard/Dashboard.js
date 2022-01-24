import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import {
  listReservations,
  listTables,
  clearTable,
  changeResStatus,
} from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../layout/reservations/ReservationDisplay";
import TableDisplay from "../layout/tables/TableDisplay";
import { Link, useRouteMatch } from "react-router-dom";
//test
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const route = useRouteMatch();
  const q = useQuery();

  useEffect(() => {
    function updateDate() {
      const dateQ = q.get("date");
      if (dateQ) {
        setDate(dateQ);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [q, setDate, route]);

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

  const handleCancel = async (resId) => {
    const abortController = new AbortController();
    const status = { status: "cancelled" };
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        await changeResStatus(resId, status, abortController.signal);
        loadDashboard();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setReservationsError(err);
      }
      console.log("Abort");
    }
    return () => abortController.abort();
  };

  return (
    <main className="m-3">
      <div className="page-head-container">
        <h1>Dashboard</h1>
        <div className="mb-3">
          <h3 className="mb-0">
            Reservations for date: <span>{date}</span>
          </h3>
        </div>
        <div className="date-button-container m-2">
          <Link
            className="btn btn-primary date-button mb-2"
            to={`/dashboard?date=${previous(date)}`}
          >
            Previous
          </Link>
          <Link
            className="btn btn-primary date-button mb-2"
            to={`/dashboard?date=${today()}`}
          >
            Today
          </Link>
          <Link
            className="btn btn-primary date-button mb-2"
            to={`/dashboard?date=${next(date)}`}
          >
            Next
          </Link>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationDisplay
        reservations={reservations}
        handleCancel={handleCancel}
      />
      <TableDisplay tables={tables} handleClear={handleClear} />
    </main>
  );
}

export default Dashboard;
