import React from "react";
import { Link } from "react-router-dom";

function ReservationDisplay({ reservations, handleCancel }) {
  const reservationList = reservations.map((reservation) => {
    if (
      reservation.status === "cancelled" ||
      reservation.status === "finished"
    ) {
      return null;
    }
    return (
      <div key={reservation.reservation_id} className="reservation-tile">
        <ul className="res-data-list">
          <li>Reservation ID: <span>{reservation.reservation_id}</span></li>
          <li>First Name: <span>{reservation.first_name}</span></li>
          <li>Last Name: <span>{reservation.last_name}</span></li>
          <li>Mobile #: <span>{reservation.mobile_number}</span></li>
          <li>Party size: <span>{reservation.people}</span></li>
          <li>Reservation Time: <span>{reservation.reservation_time}</span></li>
          <li>Reservation Date: <span>{reservation.reservation_date}</span></li>
          <li data-reservation-id-status={reservation.reservation_id}>Status: <span>{reservation.status}</span>
          </li>
        </ul>
        <div className="res-button-container">
          {reservation.status === "booked" ? (
            <>
              <Link
                className="btn btn-primary reservation-button"
                to={`/reservations/${reservation.reservation_id}/seat`}
              >
                Seat
              </Link>

              <Link
                className="btn btn-info reservation-button"
                to={`/reservations/${reservation.reservation_id}/edit`}
              >
                Edit
              </Link>
            </>
          ) : null}

          <button
            className=" btn btn-danger reservation-button"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={() => handleCancel(reservation.reservation_id)}
          >
            Cancel Reservation
          </button>
        </div>
      </div>
    );
  });

  return <div className="reservations-container">{reservationList}</div>;
}

export default ReservationDisplay;
