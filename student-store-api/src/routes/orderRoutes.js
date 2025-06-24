const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  console.log("get orders");
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE an order
router.post("/", async (req, res) => {
  const { customer_id, total_price, status, created_at } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        customer_id,
        total_price,
        status,
        created_at: created_at ? new Date(created_at) : undefined,
      },
    });
    res.json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_id, total_price, status, created_at } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { order_id: parseInt(id) },
      data: {
        customer_id,
        total_price,
        status,
        created_at: created_at ? new Date(created_at) : undefined,
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order", details: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await prisma.order.delete({
      where: { order_id: parseInt(id) },
    });
    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
});

router.get("/:id/items", async (req, res) => {
  const { id } = req.params;

  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId: parseInt(id) },
      include: { product: true },
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order items", details: err.message });
  }
});


module.exports = router;
