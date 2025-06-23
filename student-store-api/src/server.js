const express = require('express')
const router = express.Router(); 
const productsRoutes = require('../src/routes/productsRoutes')


const app = express()
const PORT = 4000

app.use(express.json())
app.use('/products', productsRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('This is project for Unit 4')
})
