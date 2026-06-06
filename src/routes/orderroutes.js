const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getKitchenOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/kitchen", getKitchenOrders);
router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;