const mongoose = require("mongoose");

const Product = require("../models/product");

exports.prodcuts_get_all = (req, res, next) => {
  Product.find()
    .select("_id title description price productImage")
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => {
          return {
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            productImage: product.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + product._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_created_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(product => {
      res.status(201).json({
        message: "product Stored",
        created: {
          _id: product._id,
          title: product.title,
          price: product.price,
          description: product.description
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products" + product._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id title price description productImage")
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/"
          }
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Data Not Found into database for this ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updatePro = {};
  for (const pro of req.body) {
    updatePro[pro.propName] = pro.value;
  }
  console.log(updatePro);
  Product.updateOne({ _id: id }, { $set: updatePro })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Update Suceess fully", id: id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.prodcuts_delete_product = (req, res, next) => {
  const id = req.params.prodctId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
