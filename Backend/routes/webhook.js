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

    // 1. DATABASE CHECK//
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

    // 2. SMART DATA HANDLING
    // This allows the code to look at the ROOT of req.body if 'data' isn't there (Test Pings)
    const payload = req.body.data || req.body;
    console.log("RAW BODY RECEIVED:", JSON.stringify(req.body, null, 2));

    // 3. TEST PING FILTER
    // If it's a test ping, Alchemy won't include 'block' or 'logs'. 
    // We return 200 so the webhook stays enabled, but we stop execution here.
    if (!payload || !payload.block || !payload.block.logs || payload.block.logs.length === 0) {
      console.log("Empty Payload or Test Ping received. Acknowledging with 200.");
      return res.status(200).json({ 
        status: "ignored", 
        message: "Acknowledged. Send a real transaction to trigger DB update." 
      });
    }

    // 4. REAL TRANSACTION PROCESSING
    console.log("Processing Real Blockchain Event...");
    
    const iface = new ethers.Interface([
       "event OrderPlaced(string orderId, address buyer, uint256 amount)"
    ]);

    const log = payload.block.logs[0]; 
    const decoded = iface.parseLog(log);

    if (!decoded) {
        return res.status(200).json({ 
            message: "DecodeError: Log did not match OrderPlaced signature", 
            receivedLog: log 
        });
    }

    const orderId = decoded.args.orderId; 
    console.log("Decoded Order ID from Blockchain:", orderId);

    // 5. DATABASE UPDATE
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: "Paid" },
      { new: true }
    );

    if (!updatedOrder) {
      console.log("Order ID found on chain but not in MongoDB yet:", orderId);
      return res.status(200).json({ 
        message: "Blockchain event received, but order not found in DB.", 
        id: orderId 
      });
    }

    console.log("Order successfully updated to 'Paid'!");
    res.status(200).json({ status: "success", order: updatedOrder });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    // Still return 200 for logical errors to keep Alchemy from disabling the hook
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;