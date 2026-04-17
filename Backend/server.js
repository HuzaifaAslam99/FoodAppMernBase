require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const customerOrderRoutes = require('./routes/customerOrders');

const productRoutes = require('./routes/products');
const profileRoutes = require('./routes/userProfile');
const orderRoutes = require('./routes/order');
// const orderRoutes = require('./routes/order');

const productSchema = require('./models/food-products');
const orderSchema = require('./models/food-order');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.USERS_DB_URI)
  .then(() => console.log('Connected to Users DB'))
  .catch(err => console.error('Users DB error:', err));


const productConn = mongoose.createConnection(process.env.PRODUCTS_DB_URI);
productConn.on('connected', () => console.log('Connected to Products DB'));

const Product = productSchema(productConn);
app.locals.Product = Product;

const orderConn = mongoose.createConnection(process.env.ORDERS_DB_URI);
orderConn.on('connected', () => console.log('Connected to Orders DB'));

const Order = orderSchema(orderConn);
app.locals.Order = Order;

app.get("/", (req, res) => {
    res.send("Backend is working! API is ready.");
});

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use("/api",protectedRoutes)
app.use("/api",profileRoutes)
app.use("/api",orderRoutes)
app.use("/api", customerOrderRoutes)
 


// Product.find().then(data => console.log("Server-side check:", data.length, "items found"));
module.exports = app;