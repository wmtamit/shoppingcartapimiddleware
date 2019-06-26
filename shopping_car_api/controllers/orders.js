const mongoose = require("mongoose");

const Order=require('../models/order')
const Product = require("../models/product");


exports.orders_get_all=(req, res, next) => {
    Order.find()
      .select("product quantity _id ")
      .populate('product',"title")
      .exec()
      .then(results => {
        res.status(200).json({
          count: results.length,
          orders: results.map(result => {
            return {
              _id: result._id,
              product: result.product,
              quantity: result.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders" + result._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

exports.order_create=(req, res, next) => {  
    Product.findById(req.body.productId)
      .then(product => {
          if(!product){
              return res.status(404).json({
                  message:"Product not found",
              })
          }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        res.status(201).json({
          message: "Order Stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders" + result._id
          }
        });
      })
      .catch(err => {
        res.status.json({
          message: "Product Not Found",
          error: err
        });
      });
  }



exports.orders_get_one_order=(req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order=>{
        if(!order){
            res.status(404).json({
                message:"Order Not Found"
            })
        }
        res.status(200).json({
            order:order,
            request:{
                type:"GET",
                url:"http://localhost:3000/orders"
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.orders_delete_order=(req,res,next)=>{
    Order.remove({_id:req.params.orderId}).exec()
    .then(result=>{
        res.status(200).json({
            message:"Order deleted",
            request:{
                type:"GET",
                url:"http://localhost:3000/orders",
                body:{productId:"ID",quantity:"Number"}
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}