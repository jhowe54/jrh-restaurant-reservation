import React from "react";
import { Link } from "react-router-dom";

function ReservationDisplay({ reservations, handleCancel }) {
  const reservationList = reservations.map((reservation, index) => {
    if (
      reservation.status === "cancelled" ||
      reservation.status === "finished"
    ) {
      return null;
    }
    return (
      <div key={reservation.reservation_id}>
        <ul key={reservation.reservation_id}>
          <h5>Reservation Id: {reservation.reservation_id}</h5>
          <li>First Name: {reservation.first_name}</li>
          <li>Last Name: {reservation.last_name}</li>
          <li>Party Size: {reservation.people}</li>
          <li>Reservation Time: {reservation.reservation_time}</li>
          <li>Reservation Date: {reservation.reservation_date}</li>
          <li data-reservation-id-status={reservation.reservation_id}>
            Reservation status: {reservation.status}
          </li>
          {reservation.status === "booked" ? (
            <>
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
              </Link>
              <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                Edit
              </Link>
            </>
          ) : null}
        </ul>
        <button
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={() => handleCancel(reservation.reservation_id)}
        >
          Cancel
        </button>
      </div>
    );
  });

  return reservationList;
}

export default ReservationDisplay;
