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

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

const dateIsFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeIsFormatted = /[0-9]{2}:[0-9]{2}/;

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
    if (
      field === "reservation_date" &&
      !dateIsFormatted.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `Requires ${field} to be a properly formatted date`,
      });
    }
    if (
      field === "reservation_time" &&
      !timeIsFormatted.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `Requires ${field} to be a properly formatted time`,
      });
    }
  });

  next();
}
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "people"
); 

function isValidDayOfWeek(req, res, next) {
  if (req.body.data) {
    req.body = req.body.data;
  }
  const data = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let dayofWeek = days[reservationDate.getDay()];
  let timeOfDay = data.reservation_time;

  if (reservationDate < new Date() && dayofWeek === "tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created for a future date and may not be on tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created for a future date",
    });
  }
  if (dayofWeek === "Tuesday") {
    return next({ status: 400, message: "Restaurant is closed on tuesdays" });
  }
  if (timeOfDay >= "21:30" || timeOfDay <= "10:30") {
    return next({
      status: 400,
      message: "Reservations must be between 10:30am and 9:30pm ",
    });
  }

  next();
}

function isBooked(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "New reservations cannot start with a status of seated or finished",
    });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { data } = req.body;
  //if current reservation status is already "finished" then it cannot be updated
  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated",
    });
  }
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (!validStatuses.includes(data.status)) {
    return next({ status: 400, message: "Received unknown status" });
  }
  next();
}


async function create(req, res, next) {
  const newReservation = await service.create(req.body);
  res.status(201).json({ data: newReservation });
}

async function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function updateReservation(req, res) {
  const updatedReservation = {
    ...req.body,
  };
  const data = await service.updateReservation(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await service.updateReservation(updatedReservation);
  res.json({ data });
}

async function list(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    res.json({ data: await service.listDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.listPhone(mobile_number) });
  } else {
    res.json({ data: await service.list() });
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    isBooked,
    isValidDayOfWeek,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    isValidDayOfWeek,
    asyncErrorBoundary(updateReservation),
  ],
};
