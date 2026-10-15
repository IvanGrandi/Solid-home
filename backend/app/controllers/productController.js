const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Fields a client is allowed to set; everything else (id, ratings, timestamps) is ignored
const EDITABLE_FIELDS = ["product_name", "description", "img", "quantity_available", "price", "category"];

const pickEditableFields = (body) => {
  const fields = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) fields[field] = body[field];
  }
  return fields;
};

// Returns an error message, or null when the fields are valid
const validateProductFields = (fields) => {
  if (fields.price !== undefined && !(Number(fields.price) >= 0)) {
    return "Price must be a number greater than or equal to 0.";
  }
  if (fields.quantity_available !== undefined) {
    const quantity = Number(fields.quantity_available);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return "Quantity available must be a whole number greater than or equal to 0.";
    }
  }
  return null;
};

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const product = pickEditableFields(req.body);

    if (!product.product_name || product.price == null || product.price === "" || product.quantity_available == null || product.quantity_available === "") {
      return res.status(400).json({ message: "Product name, price and quantity available are required!" });
    }
    const validationError = validateProductFields(product);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while creating the Product." });
  }
};

// Retrieve all Products from the database.
exports.findAll = async (req, res) => {
  try {
    const title = req.query.title;
    const condition = title ? { product_name: { [Op.like]: `%${title}%` } } : null;

    const data = await Product.findAll({ where: condition });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while retrieving Products." });
  }
};

// Find a single Product with an ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while retrieving the Product." });
  }
};

// Update a Product by the ID in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = pickEditableFields(req.body);
    const validationError = validateProductFields(fields);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    await product.update(fields);
    res.status(200).json({ message: "Product updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while updating the Product." });
  }
};

// Delete a Product with the specified ID in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while deleting the Product." });
  }
};

// Delete all Products from the database
exports.deleteAll = async (req, res) => {
  try {
    // TRUNCATE always reports 0 affected rows, so there is no count to check here
    await Product.destroy({ where: {}, truncate: true });
    res.status(200).json({ message: "All Products deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while deleting all Products." });
  }
};

// Find Products by title
exports.findByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const data = await Product.findAll({
      where: { product_name: { [Op.like]: `%${title}%` } },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: `No Products found with title "${title}".` });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while searching for Products by title." });
  }
};

// Submit a new rating
exports.addRating = async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).send({ message: "Rating must be a whole number between 1 and 5." });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Assign a new array: Sequelize doesn't detect in-place changes to JSON columns, so push() wouldn't be saved
    product.ratings = [...(product.ratings || []), rating];
    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
