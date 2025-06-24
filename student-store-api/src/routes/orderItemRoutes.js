const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();


// router.get("/:id/items", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const items = await prisma.orderItem.findMany({
//       where: { orderId: parseInt(id) },
//       include: { product: true }, // optional: show product details
//     });

//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch order items", details: err.message });
//   }
// });

// POST /orders — create order with items
router.post("/", async (req, res) => {
  const { customer_id, total_price, status, created_at, items } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        customer_id,
        total_price,
        status,
        created_at: created_at ? new Date(created_at) : undefined,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

