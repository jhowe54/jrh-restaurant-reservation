import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { formatAsDate } from "../../utils/date-time";
import { readReservation, updateReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservationData, setReservationData] = useState(initialFormState);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setUpdateError(null);
    async function loadReservation() {
      try {
        const response = await readReservation(
          reservation_id,
          abortController.signal
        );
        setReservationData({
          ...response,
          reservation_date: formatAsDate(response.reservation_date),
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setUpdateError(error);
        }
        console.log("Abort");
      }
    }
    loadReservation();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    let newReservationDate = reservationData.reservation_date;
    reservationData.people = Number(reservationData.people);
    setUpdateError(null);
    try {
      await updateReservation(reservationData);
      setReservationData(initialFormState);
      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      setUpdateError(error);
    }

    return () => abortController.abort();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setReservationData((currentReservation) => ({
      ...currentReservation,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <div className="page-head-container">
        <h2> Edit Reservation</h2>
      </div>
      <ErrorAlert error={updateError} />
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={reservationData}
      />
    </>
  );
}

export default EditReservation;
