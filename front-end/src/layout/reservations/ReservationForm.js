import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({
  handleChange,
  handleSubmit,
  formData,
}) {
  const history = useHistory();
  
  return (
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Reservation Form</legend>
          
          <div className="item">
            <label htmlFor="first_name">First Name:</label>
            <input
              pattern="[a-zA-Z]+"
              id="first_name"
              onChange={handleChange}
              type="text"
              name="first_name"
              required
              placeholder="first name"
              value={formData.first_name}
            />
          </div>
          <div className="item">
            <label htmlFor="last_name">Last Name:</label>
            <input
              id="last_name"
              onChange={handleChange}
              type="text"
              name="last_name"
              required
              placeholder="last name"
              value={formData.last_name}
            />
          </div>
          <div className="item">
            <label htmlFor="mobile_number">Mobile Number:</label>
            <input
              id="mobile_number"
              onChange={handleChange}
              type="text"
              name="mobile_number"
              required
              placeholder="mobile_number"
              value={formData.mobile_number}
            />
          </div>
          <div className="item">
            <label htmlFor="reservation_date">Reservation Date:</label>
            <input
              id="reservation_date"
              onChange={handleChange}
              type="date"
              name="reservation_date"
              required
              placeholder="reservation_date"
              value={formData.reservation_date}
            />
          </div>
          <div className="item">
            <label htmlFor="reservation_time">Reservation Time:</label>
            <input
              id="reservation_time"
              onChange={handleChange}
              type="time"
              name="reservation_time"
              required
              placeholder="reservation_time"
              value={formData.reservation_time}
              step="900"
            />
          </div>
          <div className="item">
            <label htmlFor="people">Party Size:</label>
            <input
              id="people"
              onChange={handleChange}
              type="number"
              name="people"
              required
              placeholder="party size"
              value={formData.people}
              min={1}
            />
          </div>
        </fieldset>
        <button className="form-button btn btn-success" type="submit">Submit</button>
        <button className="form-button btn btn-secondary" type="button" onClick={() => history.push("/")}>
          Cancel
        </button>
      </form>
    
  );
}

export default ReservationForm;
