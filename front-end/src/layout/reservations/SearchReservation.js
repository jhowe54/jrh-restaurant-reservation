import React, { useState, useEffect } from "react";
import { listReservations, searchReservations } from "../../utils/api";
import { useHistory, useParams, Link } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import useQuery from "../../utils/useQuery"
import ReservationDisplay from "./ReservationDisplay";
function SearchReservations() {
 
const [errors, setErrors] = useState(null)
const [currentNumber, setCurrentNumber] = useState({currentNumber: ""})
const [matchingReservations, setMatchingReservations] = useState([])


const handleChange = (event) => {
     event.preventDefault();
     setCurrentNumber(event.target.value)
     
 }

 const handleSubmit = async (event) => {
   event.preventDefault()
  const abortController = new AbortController();
   try {
     const response = await searchReservations(currentNumber, abortController.signal)
     
     setMatchingReservations(response);
   } catch(err) {
     if(err.name !== "AbortError") {
       setErrors(err)
     } 
     console.log("Aborted")
   }
   return () => abortController.abort()
 }

 
  return (
      <div>
          <ErrorAlert error={errors} />
          <form onSubmit={handleSubmit}>
        <fieldset>
          <input
            type="search"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
          />
        </fieldset>
        <button type="submit">Find</button>
      </form>
      {matchingReservations.length ? <ReservationDisplay reservations={matchingReservations} /> :
      "No reservations found"
      }
      
      </div>


      
  );
}

export default SearchReservations;
//<ReservationDisplay reservations={reservations} />