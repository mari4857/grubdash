const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(request, response) {
  response.json({ data: orders });
}

function bodyHasDeliverTo(request, response, next) {
  const { data: { deliverTo } = {} } = request.body;
  if (deliverTo) {
    return next();
  }
  next({
    status: 400,
    message: "Order must include a deliverTo",
  });
}

function bodyHasMobileNumber(request, response, next) {
  const { data: { mobileNumber } = {} } = request.body;
  if (mobileNumber) {
    return next();
  }
  next({
    status: 400,
    message: "Order must include a mobileNumber",
  });
}

function bodyHasDish(request, response, next) {
  const { data: { dishes } = {} } = request.body;
  if (dishes && dishes.length > 0 && Array.isArray(dishes)) {
    return next();
  }
  next({
    status: 400,
    message: "Order must include a dish",
  });
}

function bodyHasDishQuantity(request, response, next) {
  const { data: { dishes } = {} } = request.body;
  dishes.forEach((dish) => {
    const quantity = dish.quantity;
    if (!quantity || quantity <= 0 || typeof quantity !== "number") {
      return next({
        status: 400,
        message: `Dish ${dishes.indexOf(
          dish
        )} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  return next();
}

function create(request, response) {
  const { data: { deliverTo } = {} } = request.body;
  const { data: { mobileNumber } = {} } = request.body;
  const { data: { status } = {} } = request.body;
  const { data: { dishes } = {} } = request.body;

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  response.status(201).json({ data: newOrder });
}

module.exports = {
  list,
  create: [
    bodyHasDeliverTo,
    bodyHasMobileNumber,
    bodyHasDish,
    bodyHasDishQuantity,
    create,
  ],
};
