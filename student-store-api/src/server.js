const express = require('express')
const router = express.Router(); 
const productsRoutes = require('../src/routes/productsRoutes')
const orderRoutes = require('../src/routes/orderRoutes')
const cors = require('cors')
const app = express()
const PORT = 4000
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use('/products', productsRoutes)
app.use("/products/:id", productsRoutes)
app.use('/orders', orderRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('This is project for Unit 4')
})
