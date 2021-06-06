const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(request, response) {
  response.json({ data: dishes });
}

function bodyHasName(request, response, next) {
  const { data: { name } = {} } = request.body;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "Dish must include a name",
  });
}

function bodyHasDescription(request, response, next) {
  const { data: { description } = {} } = request.body;
  if (description) {
    return next();
  }
  next({
    status: 400,
    message: "Dish must include a description",
  });
}

function bodyHasPrice(request, response, next) {
  const { data: { price } = {} } = request.body;
  if (price && price > 0) {
    return next();
  }
  next({
    status: 400,
    message: "Dish must include a price",
  });
}

function bodyHasImgUrl(request, response, next) {
  const { data: { image_url } = {} } = request.body;
  if (image_url) {
    return next();
  }
  next({
    status: 400,
    message: "Dish must include a image_url",
  });
}

function create(request, response) {
  const { data: { name } = {} } = request.body;
  const { data: { description } = {} } = request.body;
  const { data: { price } = {} } = request.body;
  const { data: { image_url } = {} } = request.body;

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  response.status(201).json({ data: newDish });
}

module.exports = {
  list,
  create: [
    bodyHasName,
    bodyHasDescription,
    bodyHasPrice,
    bodyHasImgUrl,
    create,
  ],
};
