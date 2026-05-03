require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const customerOrderRoutes = require('./routes/customerOrders');

const productRoutes = require('./routes/products');
// const profileRoutes = require('./routes/userProfile');
const orderRoutes = require('./routes/order');

// const productSchema = require('./models/food-products');
// const orderSchema = require('./models/food-order');
const webhookRoutes = require('./routes/webhook');


const app = express();
// app.use(cors());


const corsOptions = {
    origin: [
        "https://food-app-mern-base-omega.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
};

app.use(cors(corsOptions));



app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  try {
      console.log("Raw Binary Data:", req.body);
      req.rawBody = req.body;
      req.body = JSON.parse(req.rawBody.toString('utf8'));
      next();
  } catch (err) {
      res.status(400).send("Invalid JSON");
  }
});


app.use(express.json());


// mongoose.connect(process.env.USERS_DB_URI)
//   .then(() => console.log('Connected to Users DB'))
//   .catch(err => console.error('Users DB error:', err));

// Instead of letting it crash, use a "Try/Catch" with a retry

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Food_App_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Connection failed, retrying in 2 seconds...");
    // Wait 2 seconds and try again automatically
    setTimeout(connectDB, 2000);
  }
};

connectDB();

// const productConn = mongoose.createConnection(process.env.PRODUCTS_DB_URI);
// productConn.on('connected', () => console.log('Connected to Products DB'));

// const Product = productSchema(productConn);
// app.locals.Product = Product;

// const orderConn = mongoose.createConnection(process.env.ORDERS_DB_URI);
// orderConn.on('connected', () => console.log('Connected to Orders DB'));

// const Order = orderSchema(orderConn);
// app.locals.Order = Order;


app.get("/", (req, res) => {
    res.send("Backend is working! API is ready.");
});

// app.use("/api", webhookRoutes);

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use("/api",protectedRoutes)
app.use("/api",profileRoutes)
app.use("/api",orderRoutes)
app.use("/api", customerOrderRoutes)
app.use("/api", webhookRoutes)
 


module.exports = app;

// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });