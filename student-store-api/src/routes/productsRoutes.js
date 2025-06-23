const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/products", async (req, res) => {
  console.log("get products");
  const { category, sort } = req.query;
  console.log("Category:", category);
  let products;
  const validSortFields = ["name", "price"];

  try {
    if (category) {
      products = await prisma.product.findMany({
        where: {
          category: {
            equals: category,
            mode: 'insensitive',
          },
        },
                orderBy: validSortFields.includes(sort)
          ? {
              [sort]: "asc",
            }
          : undefined,
      });
    } else if (validSortFields.includes(sort)) {
      products = await prisma.product.findMany({
        orderBy: {
          [sort]: "asc",
        },
      });
    } else {
      products = await prisma.product.findMany();
    }

    console.log("Products:", products);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



//CREATE
router.post("/products", async (req, res) => {
  console.log(req.body);
  const { name, description, price, image_url, category } = req.body;
  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      image_url,
      category,
    },
  });
  res.json(newProduct);
});

//UPDATE
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      description,
      price,
      image_url,
      category,
    },
  });
  res.json(updatedProduct);
});

//DELETE
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  res.json(deletedProduct);
});

module.exports = router;
