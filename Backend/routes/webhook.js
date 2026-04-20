const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");


router.post("/webhook", async (req, res) => {
  try {
    // 1. Force the database to connect or use cache
    const Order = req.app.locals.Order; 

    if (!Order) {
        return res.status(500).json({ error: "Order model not initialized" });
    }

    const { data } = req.body;
    const log = data.block.logs[0];

    if (!data?.block?.logs?.length) {
        return res.status(400).json({ error: "No logs found in request" });
    }

    const iface = new ethers.Interface([
      "event OrderPlaced(string orderId)"
    ]);

    const decoded = iface.parseLog({
      topics: log.topics,
      data: log.data
    });

    if (!decoded) {
      return res.status(400).json({ error: "DecodeError" });
    }

    const orderId = decoded.args.orderId;

    // 2. Perform the update
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId }, // Matches the '7bbbb80e' string logic
      { status: "Paid" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found in DB" });
    }

    res.status(200).json({ status: "success", order: updatedOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;