import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { formatAsDate } from "../../utils/date-time";
import { readReservation, updateReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservationData, setReservationData] = useState({});
  const [updateError, setUpdateError] = useState(false);

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
    const newReservationDate = reservationData.reservation_date;
    setUpdateError(null);
    reservationData.people = Number(reservationData.people);

    try {
      await updateReservation(reservationData);
      setReservationData({});
      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      setUpdateError(error);
    }
  };

  const handleChange = ({ target }) => {
    setReservationData((currentReservation) => ({
      ...currentReservation,
      [target.name]: target.value,
    }));
  };

  return (
    <>
      <h1> Create New Reservation</h1>
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={reservationData}
        postResError={updateError}
      />
    </>
  );
}

export default EditReservation;
