
const knex = require("../db/connection");
const tableName = "tables";

async function create(newTable) {
    return await knex(tableName).insert(newTable).returning("*").then((createdRecords) => createdRecords[0])
}
function list() {
    return knex(tableName).select("*").orderBy("table_name", "asc")
}

async function update(existingTable) {
    return await knex(tableName).select("*").where({table_id: existingTable.table_id}).update(existingTable, "*").then((updatedRecords) => updatedRecords[0])
}

function read(table_id) {
    return knex(tableName).select("*").where({table_id}).first()
}

function getReservationCapacity(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first()
}

module.exports = {
    create,
    list,
    update,
    read,
    getReservationCapacity
}