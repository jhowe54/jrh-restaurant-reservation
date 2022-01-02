const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");


async function list(req, res) {
    const data = await service.list()
    res.json({ data })
}



module.exports = {
    list
}