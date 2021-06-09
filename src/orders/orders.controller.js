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

function orderIdExists(request, response, next) {
  const { orderId } = request.params;
  const foundOrderId = orders.find((order) => order.id === orderId);
  if (foundOrderId) {
    response.locals.orderId = foundOrderId;
    return next();
  }
  next({
    status: 404,
    message: "No matching order is found",
  });
}

function read(request, response) {
  response.json({ data: response.locals.orderId });
}

function update(request, response, next) {
  const { id, deliverTo, mobileNumber, status, dishes } = request.body.data;
  if (response.locals.orderId.id !== id && id) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${response.locals.orderId.id}`,
    });
  }
  if (!deliverTo) {
    return next({
      status: 400,
      message: `deliverTo does not exist`,
    });
  }
  if (!mobileNumber) {
    return next({
      status: 400,
      message: `mobileNumber does not exist`,
    });
  }
  if (!dishes || dishes.length <= 0 || !Array.isArray(dishes)) {
    return next({
      status: 400,
      message: `dishes does not exist`,
    });
  }
  if (!status || status === "invalid") {
    return next({
      status: 400,
      message: `status does not exist`,
    });
  }
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
  const order = response.locals.orderId;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  response.json({ data: order });
}

function deleteOrderById(request, response, next) {
  const orderIndex = orders.findIndex(
    (order) => order.id === request.params.orderId
  );

  if (orders[orderIndex] === undefined) {
    return next({
      status: 404,
      message: `${request.params.orderId} is undefined`,
    });
  }

  if (orders[orderIndex].status !== "pending") {
    return next({
      status: 400,
      message: `status does not equal pending`,
    });
  }

  orders.splice(orderIndex, 1);
  response.sendStatus(204);
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
  read: [orderIdExists, read],
  update: [orderIdExists, update],
  delete: [deleteOrderById],
};
