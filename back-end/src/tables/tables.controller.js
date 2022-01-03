const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");
const { table } = require("../db/connection");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  return next({ status: 400, message: "body must have data property" });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} not found`,
  });
}

async function resExists(req, res, next) {
  const reservation = await service.getReservation(req.body.data.reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.body.data.reservation_id} not found`,
  });
}

const validProperties = ["table_name", "capacity"];

async function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({ status: 400, message: "Requires request data" });
  }
  validProperties.forEach((field) => {
    if (!data[field]) {
      return next({ status: 400, message: `Requires ${field}` });
    }
    if (field === "table_name" && data.table_name.length <= 1) {
      return next({
        status: 400,
        message: `Requires ${field} to have a length greater than 1`,
      });
    }
    if (field === "capacity" && !Number.isInteger(data.capacity)) {
      return next({
        status: 400,
        message: `Requires ${field} to be a number and it must be greater than 0`,
      });
    }
  });
  next();
}

const hasResId = hasProperties("reservation_id")

async function validTable(req, res, next) {
  const {table: data} = res.locals;
  const {reservation: resData} = res.locals;
  
  if(data.capacity < resData.people) {
    return next({status: 400, message: "Insufficient capacity"})
  }
  if(data.reservation_id !== null) {
    return next({status: 400, message: "Table is currently occupied"})
  }
  
  next()
}

async function notOccupied(req, res, next) {
  const {table: data} = res.locals;
  if(data.reservation_id === null) {
    return next({status: 400, message:"Table is not occupied"})
  }
  next();
}

async function create(req, res) {
  const { data } = req.body;
  const newTable = await service.create(data);
  res.status(201).json({ data: newTable });
}

async function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: res.locals.reservation.reservation_id
  }
  const data = await service.update(updatedTable);
  
  res.json({ data });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
} 

async function clearTable(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null
  }
  const data = await service.update(updatedTable);
  
  res.json({ data });
}

module.exports = {
  list,
  read: [tableExists, read],
  create: [hasValidProperties, create],
  update: [hasData, hasResId, asyncErrorBoundary(tableExists), asyncErrorBoundary(resExists), validTable, asyncErrorBoundary(update)],
  delete: [tableExists, notOccupied, clearTable]
};
