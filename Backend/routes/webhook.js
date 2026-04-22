const express = require("express");
const router = express.Router();
const ethers = require("ethers");

router.post("/webhook", async (req, res) => {

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
    const buyerAddress = decoded.args.buyer;
    
    const Order = req.app.locals.Order;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { 
        status: "paid", 
        transactionHash: transactionHash,
        wallet_address: buyerAddress
      },
      { returnDocument: 'after' }
    );

    if (!updatedOrder) {
      console.log("Order ID not found in DB:", orderId);
      return res.status(200).json({ message: "Order not in DB", id: orderId });
    }


    console.log("Order Updated to Paid!");
    res.status(200).json({ status: "success", orderId });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;