import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newReservationDate = formData.reservation_date;
    setPostResError(null);
    formData.people = Number(formData.people);

    try {
      await createReservation(formData);
      setFormData(initialFormState);
      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      setPostResError(error);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormData((newReservation) => ({
      ...newReservation,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <h1> Create New Reservation</h1>
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        postResError={postResError}
      />
    </>
  );
}

export default NewReservation;
