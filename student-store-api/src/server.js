const express = require('express')
const router = express.Router(); 
const productsRoutes = require('../src/routes/productsRoutes')
const orderRoutes = require('../src/routes/orderRoutes')
const orderItemRoutes = require('../src/routes/orderRoutes')

const app = express()
const PORT = 4000

app.use(express.json())
app.use('/products', productsRoutes)
app.use('/orders', orderRoutes)
app.use('/orders', orderItemRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('This is project for Unit 4')
})
