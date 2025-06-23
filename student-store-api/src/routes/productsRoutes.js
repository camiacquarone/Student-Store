const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()


router.get('/products', async (req, res) => {
    console.log("get products")
  const products = await prisma.product.findMany()
  res.json(products)
})


//CREATE
router.post('/products', async (req, res) => {
  const { name, description, price, image_url, category } = req.body
  const newProduct = await prisma.product.create({
    data: {
      name,
      description, 
      price, 
      image_url, 
      category

    }
  })
  res.json(newProduct)
})

//UPDATE 
router.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, price, image_url, category } = req.body
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      description,
      price, 
      image_url, 
      category

    }
  })
  res.json(updatedProduct)
})


//DELETE 
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  const deletedProduct = await prisma.product.delete({
    where: { id: parseInt(id) }
  })
  res.json(deletedProduct)
})

module.exports = router