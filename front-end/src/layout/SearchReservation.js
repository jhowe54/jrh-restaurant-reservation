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
    <main>
      <h1 className="mb-0">Search Reservation By Phone Number</h1>
      <ErrorAlert error={errors} />
      <div className="search-reservation-form">
        <form>
          <input
            type="tel"
            id="currentNumber"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={currentNumber.mobile_number}
            required
            className="search-item mb-2"
          />
        </form>
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-secondary search-item"
        >
          Find
        </button>
      </div>
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
