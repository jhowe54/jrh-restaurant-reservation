/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

 async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} not found`,
  });
}

const dateIsDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeIsTime = /[0-9]{2}:[0-9]{2}/;


async function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({ status: 400, message: "Requires request data" });
  }
  validProperties.forEach((field) => {
    if (!data[field]) {
      return next({ status: 400, message: `Requires ${field}` });
    }
    if (field === "people" && !Number.isInteger(data.people)) {
      return next({ status: 400, message: `Requires ${field} to be a number` });
    }
    if(field === "reservation_date" && !dateIsDate.test(data.reservation_date)) {
      return next({ status: 400, message: `Requires ${field} to be a properly formatted date`})
    }
    if(field === "reservation_time" && !timeIsTime.test(data.reservation_time)) {
      return next({ status: 400, message: `Requires ${field} to be a properly formatted time`})
    }
  });
  next();
}



let days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

 function isValidDayOfWeek(req, res, next) {
  if(req.body.data) {
    req.body = req.body.data
  }
  const data = req.body; 
  const reservationDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  let dayofWeek = days[reservationDate.getDay()]
  let timeOfDay = data.reservation_time;
  
  if(reservationDate < new Date() ) {
    return next({status: 400, message: "Reservations can only be created for a future date and may not be on tuesdays"})
  }
  if(dayofWeek === "Tuesday") {
    return next({status: 400, message: "Restaurant is closed on tuesdays"})
  }
  if(timeOfDay >= "21:30" || timeOfDay <= "10:30") {
    return next({status: 400, message: "Reservations must be between 10:30am and 9:30pm "})
  }
   next()
}

 function isBooked(req, res, next) {
  const { data } = req.body;
  if(data.status === "seated" || data.status ==="finished") {
    return next({status:400, message: "New reservations cannot start with a status of seated or finished"})
  }
  next()
}

function hasValidStatus(req, res, next) {
  const { data } = req.body;
  //if current reservation status is already "finished" then it cannot be updated
  if(res.locals.reservation.status === "finished") {
    return next({status: 400, message: "A finished reservation cannot be updated"})
  }
  const validStatuses = ["booked", "seated", "finished"]
  if(!validStatuses.includes(data.status)) {
    return next({status: 400, message: "Received unknown status"})
  }
  
  next();
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "people"
);

async function list(req, res, next) {
  if(req.query.mobile_number) {
    return next()
  }
  const { date } = req.query;
  const data = await service.list(date);
  data.forEach((reservation) => {
    reservation.reservation_date = reservation.reservation_date
      .toISOString()
      .split("T")[0];
  });
  res.status(200).json({ data });
}

async function listByPhone(req, res) {
  const { mobile_number} = req.query;
  const data = await service.search(mobile_number);
  if(!data) {
    return next({status: 404, message: "No reservation found"})
  }
  res.json({ data })
}


async function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function create(req, res, next) {
  if(req.body.data) {
    req.body = req.body.data
  } 
  const data = req.body
  const newReservation = await service.create(data);
  console.log(JSON.stringify(newReservation))
  res.status(201).json({ data: newReservation });
}

async function updateStatus(req, res) {
  
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status
  }
  const data = await service.seatReservation(updatedReservation);
  //toDo: update the reservation status to seated when a table is assigned a reservation id 
  res.json({ data });
}


async function searchByPhone(req, res) {
  const data = req.body.data
  res.json({ data })
}

module.exports = {
  list: [list, listByPhone],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    isBooked,
    isValidDayOfWeek,
    asyncErrorBoundary(create),
  ],
  update: [reservationExists, hasValidStatus, updateStatus ],
};
