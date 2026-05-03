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
const webhookRoutes = require('./routes/webhook');


const app = express();


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


app.get("/", (req, res) => {
    res.send("Backend is working! API is ready.");
});

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use("/api",protectedRoutes)
app.use("/api",profileRoutes)
app.use("/api",orderRoutes)
app.use("/api", customerOrderRoutes)
app.use("/api", webhookRoutes)
 


module.exports = app;
