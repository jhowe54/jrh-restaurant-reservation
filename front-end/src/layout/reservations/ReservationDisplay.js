import React from "react";
import { Link } from "react-router-dom";

function ReservationDisplay({ reservations }) {
  const reservationList = reservations.map((reservation, index) => {
    
    if(reservation.status !== "cancelled" || reservation.status !=="finished") {
        return (
        <div key={reservation.reservation_id}>
        <ul key={reservation.reservation_id}>
          <h5>Reservation Id: {reservation.reservation_id}</h5>
          <li>First Name: {reservation.first_name}</li>
          <li>Last Name: {reservation.last_name}</li>
          <li>Party Size: {reservation.people}</li>
          <li>Reservation Time: {reservation.reservation_time}</li>
          <li>Reservation Date: {reservation.reservation_date}</li>
          <li>Reservation status: {reservation.status}</li>
          {
              reservation.status === "booked" ? <Link to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link> : null
          }
          
        </ul>
      </div>
        )
    } else {
        return null;
    }
      
    
  });

  return reservationList;
}

export default ReservationDisplay;
