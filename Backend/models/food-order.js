const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

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

    wallet_address: String,
    totalPrice: Number,
    // status: String,
    status: { type: String, default: 'pending' },
    transactionHash: String,
    ipfsHash: { type: String },
    

});


module.exports = mongoose.model('orders', OrderSchema);