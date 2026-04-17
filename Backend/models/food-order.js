const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // // 1. Link to the User (Stored in the USERS_DB)
    orderId: {type: String, required: true},
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },

    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food-products', 
            required: true
        },
        quantity: Number, 
        price: Number,
    }],

    OrderTime: { 
        type: Date, 
        default: Date.now
    },

    totalPrice: Number,
    status: String,
    transactionHash: String,

});

// IMPORTANT: This function allows server.js to bind this schema 
// specifically to the orderConn (ORDERS_DB_URI)
module.exports = (conn) => {
    return conn.model('Order', OrderSchema, 'food-orders');
};