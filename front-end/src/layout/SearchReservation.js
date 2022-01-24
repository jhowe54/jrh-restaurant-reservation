import React, { useState } from "react";
import { searchReservations, changeResStatus } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationDisplay from "./reservations/ReservationDisplay";
function SearchReservations() {
  const [errors, setErrors] = useState(null);
  const [currentNumber, setCurrentNumber] = useState({ mobile_number: "" });
  const [matchingReservations, setMatchingReservations] = useState([]);

  const handleChange = (event) => {
    event.preventDefault();
    setCurrentNumber({
      ...currentNumber,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await searchReservations(
        currentNumber.mobile_number,
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
    <main className="m-3">
      <div className="page-head-container">
        <h2>Search</h2>
        </div>
      <ErrorAlert error={errors} />

      <form className="form-card">
        <fieldset>
          <legend className="form-item">
            Search Reservation By Phone Number
          </legend>
          <div className="form-item">
            <input
              className="form-input"
              type="tel"
              id="currentNumber"
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              value={currentNumber.mobile_number}
              required
            />
          </div>
        </fieldset>
        <div className="form-item mt-2 mb-2">
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-secondary form-button"
          >
            Find
          </button>
        </div>
      </form>

      {matchingReservations && matchingReservations.length ? (
        <ReservationDisplay
          reservations={matchingReservations}
          handleCancel={handleCancel}
        />
      ) : (
        <p className="text-danger">No reservations found</p>
      )}
    </main>
  );
}

export default SearchReservations;
//<ReservationDisplay reservations={reservations} />
