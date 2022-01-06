import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
    people: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [postResError, setPostResError] = useState(null);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newReservationDate = formData.reservation_date;
    formData.people = Number(formData.people)
    await createReservation(formData).then(setFormData(initialFormState)).catch((err) => setPostResError(err));
    if(postResError) {
        console.log(postResError)
    }
    history.push(`/dashboard?date=${newReservationDate}`)
  };

  const handleChange = (event) => {
    event.preventDefault()
    setPostResError("")
    setFormData((currentReservation) => ({
      ...currentReservation,
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
