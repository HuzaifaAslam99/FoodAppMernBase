const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    category: {type: String, required: true},
    base: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    img: {type: String, required: true},

}, { timestamps: true });

module.exports = (conn) => conn.model('Product', ProductSchema, 'food-products');