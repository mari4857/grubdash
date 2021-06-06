const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass
router
  .route("/")
  .get(controller.list) //list
  .post(controller.create) //create
  .all(methodNotAllowed); //validation

module.exports = router;
