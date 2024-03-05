const express = require('express')
const app = express()
const port = 3000

var cors = require('cors')
 


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('Belajar Database')
})

app.post('/product', async (req, res) => {
    const {product_orm} = require('./models')

    const {name, price ,description, category, stock} = req.body

    await product_orm.create({
        name,
        price,
        description,
        category,
        stock
    })

    res.status(200).json({
        messages: "Success Add Data"
    })
})

app.get('/product', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})