
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUpload = require('express-fileupload')
const joi = require('joi')
const fs = require('fs')
var cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload()) 

let product_online = [
    {
        id:1,
        name:"laptop",
        description:"laptop bagus",
        price:15000000,
        stock: 50,
        image:"/images/laptop.jpg" 
    },
    {
        id:2,
        name:"Keyboard",
        description:"keyboard bagus",
        price:650000,
        stock: 50,
        image:"/images/keyboard.jpg"
    },
    {
        id:3,
        name:"monitor",
        description:"monitor bagus",
        price:2500000,
        stock: 50,
        image:"/images/monitor.jpg"
    },
    {
        id:4,
        name:"mouse",
        description:"mouse bagus",
        price:350000,
        stock: 50,
        image:"/images/mouse.jpg"
    }
]

let keranjang = [
  {
    id:3,
    name:"monitor",
    price:2500000,
    total:2
  },
  {
    id:2,
    name:"Keyboard",
    price:650000,
    total:3
  }
]

//validate tambah product
const validateproduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().min(3).required(),
    price: joi.number().required(),
    stock: joi.number().required(),
  })

  return schema.validate(product)
}

//validate total product di keranjang
const validatetotal = (product) => {
  const schema = joi.object({
    total: joi.number().required(),
  })

  return schema.validate(product)
}

app.get('/', (req, res) => {
  res.send('Selamat Datang di Toko BIG TESLA')
})
//route product

//get all product
app.get('/product', (req,res) => {

  res.status(200).json({
    messages: "Success Get All Data",
    data:product_online
  })
})

//get detail product by id
app.get('/product/:id', (req, res) => {
  const id = req.params.id

  const product = product_online.find(product  => product.id == id)

  if(!product) {
    res.status(404).json({
      messages: "Data not found"
    })
  }

  res.status(200).json({
    messages: "Success Get Detail Data",
    data: product
  })
})

//add product
app.post('/product', (req, res) => {
  const {name, description, price, stock} = req.body

  const id = product_online.length + 1;

  const {error} = validateproduct(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const image = req.files.image
  const filenamejoin = name.split(" ").join("");
  const filename = `${filenamejoin}.jpg`

  image.mv(path.join(__dirname, 'public/images', filename))

  const newproduct = {
    id,
    name,
    description,
    price,
    stock,
    image: `/images/${filename}`,
  }

  product_online.push(newproduct)

  res.status(201).json({
    messages: "Success add Data",
    data : newproduct
  })
})

//edit data product
app.put('/product/:id', (req, res) => {
  const id = req.params.id
  const {name, description, price, stock} = req.body

  const {error} = validateproduct(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const product = product_online.find(product => product.id == id)

  if(!product) {
    return res.status(404).json({
      messages: "Product not found"
    })
  }

  const fileNameOld = `${product.name}.jpg`
  product.name = name
  product.description = description
  product.price = price
  product.stock = stock
  
  const image = req.files.image

  if(image) {
    try{
      fs.unlinkSync(path.join(__dirname, 'public/images', fileNameOld))
    }catch(err){
    console.log(err)
    }
    const filename = `${name}.jpg`
    image.mv(path.join(__dirname, 'public/images', filename))
    product.image = `/images/${filename}`
  }

  res.status(201).json({
    messages:"Success Upadate Data",
    data: product
  })

})

//delete product
app.delete(`/product/:id`, (req,res) => {
  const id = req.params.id

  const product = product_online.find(product => product.id == id)
  if(!product){
    return res.status(404).json({
      messages:"Data not found"
    })
  }

  const index = product_online.indexOf(product)
  product_online.splice(index, 1)

  res.status(200).json({
    messages:"Success Delete Data",
    data: product
  })
})


// route keranjang

//liat semua keranjang
app.get('/keranjang', (req, res) => {
  res.status(200).json({
    messages: "Success Get All Data keranjang",
    data: keranjang
  })
})


//tambah barang ke keranjang
app.post(`/keranjang`, (req,res) => {
  const {id, total} = req.body

  const dataproduct = product_online.find(product => product.id == id)

  if(!dataproduct){
    return res.status(404).json({
      message: "Data not found"
    })
  }

  const indexKeranjang = keranjang.findIndex(product => product.id == id);

  if (indexKeranjang != -1) {
    keranjang[indexKeranjang].total += total
    return res.status(200).json({
      message: "Total barang sudah diubah",
      data: keranjang
    })
  }

  keranjang.push({
    id: dataproduct.id,
    name: dataproduct.name,
    price: dataproduct.price,
    total
  })

  return res.status(200).json({
    message: "Barang berhasil ditambahkan ke keranjang",
    data: keranjang
  })

})

// delete item di keranjang
app.delete('/keranjang/:id', (req, res) => {
  const {id} = req.params

  const indexKeranjang = keranjang.findIndex(product => product.id == id);
  keranjang.splice(indexKeranjang, 1)

  return res.status(200).json({
    message: "Barang berhasil dihapus dari keranjang",
    data: keranjang
  })
}) 

//edit jumlah item di keranjang
app.put('/keranjang/:id', (req, res) => {
  const id = req.params.id
  const {total} = req.body

  const {error} = validatetotal(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const product = keranjang.find(product => product.id == id)

  if(!product) {
    return res.status(404).json({
      messages: "Data Not Found"
    })
  }

  product.total = total

  res.status(201).json({
    messages: "Success Update Data",
    data: keranjang
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})