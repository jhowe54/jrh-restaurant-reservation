const knex = require("../db/connection");
const tableName = "reservations";

function list() {
  return knex(tableName).select("*").whereNot({ status: "finished" });
}

function listDate(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .andWhereNot({ status: "cancelled" })
    .orderBy("reservation_time", "asc");
}

function listPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservation_id) {
  return knex(tableName).select("*").where({ reservation_id }).first();
}

async function create(newReservation) {
  return await knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function updateReservation(reservation) {
  return await knex(tableName)
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listDate,
  listPhone,
  read,
  create,
  updateReservation,
};
