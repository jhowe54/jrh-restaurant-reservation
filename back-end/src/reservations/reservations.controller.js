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
  read: [reservationExists, read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
};
