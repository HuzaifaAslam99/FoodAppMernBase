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



// TEMPORARY ROUTE FOR LOAD.IO VERIFICATION (Delete after verifying!)

// app.get('/loaderio-070909ea141525027451409c1624b0d8.txt', (req, res) => {
//   res.send('loaderio-070909ea141525027451409c1624b0d8');
// });


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









// {
//   "event": {
//     "data": {
//       "block": {
//         "logs": [
//           {
//             "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000084f52442d31323334000000000000000000000000000000000000000000000000",
//             "topics": [
//               "0xc33190277387bfba0402dc07dafad106abb05758e55fa7c1519e0d1f5dcc63da"
//             ],
//             "transaction": {
//               "hash": "0xfed9dd26e7da021dec4233fb156120b7e22ebff84928ef6b2885b8237a27eff7"
//             }
//           }
//         ]
//       }
//     }
//   }
// }