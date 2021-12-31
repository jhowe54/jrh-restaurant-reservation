const knex = require("../db/connection");
const tableName = "reservations";

function list(date) {
    return knex(tableName).whereNot({status: "finished"}).andWhereNot({ status: "cancelled"}).andWhere({ "reservation_date" : date}).orderBy("reservation_time", "asc").then()
    
}

function read(reservation_id) {
    return knex(tableName).select("*").where({reservation_id}).first()
}

function create(newReservation) {
    return knex(tableName).insert(newReservation).returning("*").then((createdRecords) => createdRecords[0])
}


module.exports = {
    list,
    read, 
    create
}