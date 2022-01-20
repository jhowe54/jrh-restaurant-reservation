const knex = require("../db/connection");
const tableName = "tables";

async function create(newTable) {
  return await knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
function list() {
  return knex(tableName).select("*").orderBy("table_name", "asc");
}

async function update(updatedTable) {
  return await knex(tableName)
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function read(table_id) {
  return knex(tableName).select("*").where({ table_id }).first();
}

function getReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

async function clearTable(updatedTable) {
  return await knex(tableName)
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  create,
  list,
  update,
  read,
  getReservation,
  clearTable,
};
