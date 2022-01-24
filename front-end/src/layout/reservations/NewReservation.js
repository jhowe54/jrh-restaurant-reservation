import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
function NewReservation() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [postResError, setPostResError] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    setFormData((newReservation) => ({
      ...newReservation,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    let newReservationDate = formData.reservation_date;
    setPostResError(null);
    formData.people = Number(formData.people);

    try {
      await createReservation(formData, abortController.signal);
      setFormData(initialFormState);
      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      setPostResError(error);
    }
    return () => abortController.abort();
  };
  return (
    <main className="m-3">
      <div className="page-head-container">
        <h2> Create New Reservation</h2>
      </div>
      <ErrorAlert error={postResError} />
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </main>
  );
}

export default NewReservation;
