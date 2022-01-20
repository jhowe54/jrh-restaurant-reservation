/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create);
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.delete);
router.route("/:table_id").get(controller.read);

module.exports = router;
