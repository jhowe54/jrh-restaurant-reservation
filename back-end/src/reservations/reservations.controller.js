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
  const reservation = await service.read(req.params.reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} not found`,
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
  let dayName = days[reservationDate.getDay()]
  if(reservationDate < new Date() ) {
    return next({status: 400, message: "Reservations can only be created for a future date and may not be on tuesdays"})
  }
  if(dayName === "Tuesday") {
    return next({status: 400, message: "Restaurant is closed on tuesdays"})
  }
   next()
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "people"
);

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  data.forEach((reservation) => {
    reservation.reservation_date = reservation.reservation_date
      .toISOString()
      .split("T")[0];
  });
  res.status(200).json({ data });
}



async function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    isValidDayOfWeek,
    asyncErrorBoundary(create),
  ],
};
