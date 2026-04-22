const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "2144627", // Find this in 'App Keys' tab
  key: "939ec1fb67d612d4c2be",
  secret: "175b6073f02aa1505d92", // Find this in 'App Keys' tab
  cluster: "ap2",
  useTLS: true
});

router.post("/webhook", async (req, res) => {
  // 1. Log the full thing so we can celebrate when it works
  console.log("FULL ALCHEMY PAYLOAD:", JSON.stringify(req.body, null, 2));

  try {

    const logs = req.body.event?.data?.block?.logs;

    if (!logs || logs.length === 0) {
      console.log("No logs found. This might be a test ping.");
      return res.status(200).json({ status: "ignored" });
    }

    const transactionHash = logs[0].transaction?.hash

    const iface = new ethers.Interface([
       "event OrderPlaced(string orderId, address buyer, uint256 amount)"
    ]);

    // 3. Decode the first log
    const decoded = iface.parseLog(logs[0]);
    const orderId = decoded.args.orderId; 
    
    const Order = req.app.locals.Order;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { 
        status: "paid", 
        transactionHash: transactionHash 
      },
      { returnDocument: 'after' }
    );

    if (!updatedOrder) {
      console.log("Order ID not found in DB:", orderId);
      return res.status(200).json({ message: "Order not in DB", id: orderId });
    }

    else {

      console.log("updatedOrder.customerId:", updatedOrder.customerId);
      console.log("Triggering channel:", `user_payments_${updatedOrder.customerId}`);

      pusher.trigger(`user_payments_${updatedOrder.customerId.toString()}`, 'payment_confirmed', {
        orderId: orderId,
        status: "paid"
      
      });
      //  }

      console.log(`Real-time signal sent for order: ${orderId}`);
    }

    console.log("Order Updated to Paid!");
    res.status(200).json({ status: "success", orderId });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;