import React, { useState } from "react";
import { searchReservations, changeResStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationDisplay from "./ReservationDisplay";
function SearchReservations() {
  const [errors, setErrors] = useState(null);
  const [currentNumber, setCurrentNumber] = useState({ currentNumber: "" });
  const [matchingReservations, setMatchingReservations] = useState([]);

  const handleChange = (event) => {
    event.preventDefault();
    setCurrentNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await searchReservations(
        currentNumber,
        abortController.signal
      );

      setMatchingReservations(response);
    } catch (err) {
      if (err.name !== "AbortError") {
        setErrors(err);
      }
      console.log("Aborted");
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
        const response = await searchReservations(
          currentNumber,
          abortController.signal
        );
        setMatchingReservations(response);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setErrors(err);
      }
      console.log("Aborted");
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <fieldset>
          <input
            type="search"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
          />
        </fieldset>
        <button type="submit">Find</button>
      </form>
      {matchingReservations && matchingReservations.length ? (
        <ReservationDisplay
          reservations={matchingReservations}
          handleCancel={handleCancel}
        />
      ) : (
        "No reservations found"
      )}
    </div>
  );
}

export default SearchReservations;
//<ReservationDisplay reservations={reservations} />
