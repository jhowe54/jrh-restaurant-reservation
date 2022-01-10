const knex = require("../db/connection");
const tableName = "reservations";

function list(date) {
    return knex(tableName)
    .whereNot({status: "finished"})
    .andWhereNot({ status: "cancelled"})
    .andWhere({ "reservation_date" : date})
    .orderBy("reservation_time", "asc")
}

function read(reservation_id) {
    return knex(tableName).select("*").where({reservation_id}).first()
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }
function create(newReservation) {
    return knex(tableName).insert(newReservation).returning("*").then((createdRecords) => createdRecords[0])
}

function updateReservation(reservation) {
    return knex(tableName)
    .select("*")
    .where({reservation_id: reservation.reservation_id})
    .update(reservation, "*")
    .then((updatedRecords) => updatedRecords[0])
}






module.exports = {
    list,
    read, 
    create,
    updateReservation,
    search
}