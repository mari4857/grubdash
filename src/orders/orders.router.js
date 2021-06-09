const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass
router
  .route("/:orderId")
  .get(controller.read) //read
  .put(controller.update) //update
  .delete(controller.delete) //delete
  .all(methodNotAllowed); //validation

router
  .route("/")
  .get(controller.list) //list
  .post(controller.create) //create
  .all(methodNotAllowed); //validation

module.exports = router;
