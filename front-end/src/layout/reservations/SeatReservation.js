import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { seatTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import TableSelect from "../tables/TableSelect";

function SeatReservation() {
  const reservationId = useParams();
  const [tableId, setTableId] = useState(3);
  const [seatingError, setSeatingError] = useState(null);
  const history = useHistory();

  const handleChange = (event) => {
    event.preventDefault();
    console.log("TABLEID", tableId);
    setTableId(Number(event.target.value));
  };

  const handleSeatTable = async (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    await seatTable(
      reservationId.reservation_id,
      tableId,
      abortController.signal
    )
      .then(() => history.push("/"))
      .catch(setSeatingError);
    return () => abortController.abort();
  };

  return (
    <div>
      <h4>Seating Reservation Id: {reservationId.reservation_id}</h4>
      <ErrorAlert error={seatingError} />
      <form onSubmit={handleSeatTable}>
        <fieldset>
          <label htmlFor="table_id">Select a Table</label>
          <select name="table_id" onChange={handleChange}>
            <TableSelect />
          </select>
          <input type="submit" value={"Submit"} />
          <input type="button" value={"Go Back"} onClick={() => history.goBack()} />
          
        </fieldset>
        
      </form>
    </div>
  );
}

export default SeatReservation;
