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

router.get("/:order_id", async (req, res) => {
  const id = parseInt(req.params.order_id);
  const item = await prisma.Order.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

// CREATE an order
router.post("/", async (req, res) => {
  const { customer_id, total_price, status, created_at } = req.body;
  console.log("hitting order routes");
  try {
    const newOrder = await prisma.Order.create({
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
    res
      .status(500)
      .json({ error: "Failed to update order", details: error.message });
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
    res
      .status(500)
      .json({ error: "Failed to delete order", details: error.message });
  }
});

router.get("/:id/items", async (req, res) => {
  const { id } = req.params;
  console.log("hitting this route");
  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId: parseInt(id) },
      include: { product: true },
    });

    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch order items", details: err.message });
  }
});

router.post("/:order_id/items", async (req, res) => {
  const { order_id } = req.params;
  const { productId, quantity } = req.body;
  console.log("/orderID/items");
  try {
    const foundProduct = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    //console.log(foundProduct)
    const newItem = await prisma.orderItem.create({
      data: {
        order: { connect: { order_id: parseInt(order_id) } }, // Correctly links to the order
        product: { connect: { id: parseInt(productId) } }, // In case you're using a relation
        quantity,
        price: foundProduct.price,
      },
    });
    let final_price = foundProduct.price * parseInt(quantity) * 1.0875
    await prisma.order.update({
      where: {
        order_id: parseInt(order_id), 
      }, 
      data:{
        total_price:{
          increment: parseFloat(final_price.toFixed(2))
        }
      }
    })

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({
      error: "Failed to add item to order",
      details: error.message,
    });
  }
});

router.get("/:order_id/total", async (req, res) => {
  const { order_id } = req.params;

  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId: parseInt(order_id) },
      include: { product: true },
    });
    const total_price = items
      .map((item) => item.quantity * item.product.price) //for item in items //if there are 3 books multiply that by the price of one
      .reduce((sum, price) => sum + price, 0); //sums up all the values in the array //current price + the current sum , 0 represents initital value

    res.json({ order_id: parseInt(order_id), total_price });
  } catch (err) {
    res.status(500).json({
      error: "Failed to calculate order total",
      details: err.message,
    });
  }
});

module.exports = router;
