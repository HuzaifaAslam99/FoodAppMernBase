const express = require("express");
const router = express.Router();
const ethers = require("ethers");

router.post("/webhook", async (req, res) => {
  try {
    const Order = req.app.locals.Order;
    const orderConn = req.app.locals.orderConn;

    if (!Order || !orderConn) {
      return res.status(500).json({ error: "Order system not initialized" });
    }

    // 1. GATEKEEPER: Ensure the database "pipe" is actually open
    // readyState 1 means Connected.
    if (orderConn.readyState !== 1) {
      console.log("DB not ready, waiting...");
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Database timeout")), 10000);
        orderConn.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }

    // 2. DATA CHECK: Ensure Alchemy sent logs
    const { data } = req.body; 
    if (!data?.block?.logs?.length) {
      return res.status(400).json({ error: "No logs in request" });
    }

    const iface = new ethers.Interface([
       "event OrderPlaced(string orderId, address buyer, uint256 amount)"
    ]);

    // FIX: Use the 'data' variable you already extracted above
    const log = data.block.logs[0]; 
    const decoded = iface.parseLog(log);

    if (!decoded) {
        return res.status(400).json({ 
            message: "DecodeError", 
            receivedData: data, 
            receivedLog: log 
        });
    }

    // Now you can access the specific orderId
    const orderId = decoded.args.orderId; 
    console.log("Decoded Order ID:", orderId);


    // 4. DATABASE UPDATE
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: "Paid" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found", id: orderId });
    }

    res.status(200).json({ status: "success", order: updatedOrder });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;