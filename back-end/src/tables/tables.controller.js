const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties("reservation_id");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }

  next({ status: 400, message: "body must have data property" });
}
const validProperties = ["capacity", "table_name"];
async function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  validProperties.forEach((field) => {
    if (!data[field]) {
      return next({ status: 400, message: `Requires ${field}` });
    }
    if (field === "table_name" && data.table_name.length <= 1) {
      return next({ status: 400, message: `Requires ${field} to be a number` });
    }
    if (field === "capacity" && !Number.isInteger(data.capacity)) {
      return next({
        status: 400,
        message: `Requires ${field} to be a properly formatted date`,
      });
    }
    if (
      field === "reservation_time" &&
      !timeIsTime.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `Requires ${field} to be a properly formatted time`,
      });
    }
  });
  next();
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

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function hasCapacity(req, res, next) {
  const resData = await service.getReservationCapacity(
    req.body.data.reservation_id
  );

  if (!resData) {
    return next({
      status: 404,
      message: `Reservation ${req.body.data.reservation_id} does not exist`,
    });
  }
  if (resData.people > res.locals.table.capacity) {
    return next({
      status: 400,
      message: "Party size exceeds this table's capacity",
    });
  }
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${res.locals.table_id} is already occupied or has not been cleared`,
    });
  }
  next();
}

async function assignReservation(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  await service.update(updatedTable);
  const newTable = await service.read(updatedTable.table_id);

  const newTableStatus = {
    ...newTable,
  };
  res.status(200).json({ data: newTableStatus });
}

async function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data });
}

async function create(req, res, next) {
  if (req.body.data) {
    req.body = req.body.data;
  }
  const data = req.body;
  const newTable = await service.create(data);
  console.log(JSON.stringify(newTable));
  res.status(201).json({ data: newTable });
}
module.exports = {
  list,
  read: [tableExists, read],
  update: [
    hasData,
    hasRequiredProperties,
    tableExists,
    hasCapacity,
    assignReservation,
  ],
  create: [hasData, hasValidProperties, asyncErrorBoundary(create)],
};
