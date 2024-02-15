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

let produk_online = [
    {
        id:1,
        nama:"laptop",
        deskripsi:"laptop bagus",
        harga:15000000,
        stok: 50,
        image:"/images/laptop.jpg" 
    },
    {
        id:2,
        nama:"Keyboard",
        deskripsi:"keyboard bagus",
        harga:650000,
        stok: 50,
        image:"/images/keyboard.jpg"
    },
    {
        id:3,
        nama:"monitor",
        deskripsi:"monitor bagus",
        harga:2500000,
        stok: 50,
        image:"/images/monitor.jpg"
    },
    {
        id:4,
        nama:"mouse",
        deskripsi:"mouse bagus",
        harga:350000,
        stok: 50,
        image:"/images/mouse.jpg"
    }
]

let keranjang = [
  {
    id:3,
    nama:"monitor",
    harga:2500000,
    total:2
  },
  {
    id:2,
    nama:"Keyboard",
    harga:650000,
    total:3
  }
]

//validasi tambah produk
const validasiproduk = (produk) => {
  const schema = joi.object({
    nama: joi.string().min(3).required(),
    deskripsi: joi.string().min(3).required(),
    harga: joi.number().required(),
    stok: joi.number().required(),
  })

  return schema.validate(produk)
}

//validasi total produk di keranjang
const validasitotal = (produk) => {
  const schema = joi.object({
    total: joi.number().required(),
  })

  return schema.validate(produk)
}

app.get('/', (req, res) => {
  res.send('Selamat Datang di Toko BIG TESLA')
})
//route product

//get all produk
app.get('/produk', (req,res) => {

  res.status(200).json({
    messages: "Success Get All Data",
    data:produk_online
  })
})

//get detail produk by id
app.get('/produk/:id', (req, res) => {
  const id = req.params.id

  const produk = produk_online.find(produk  => produk.id == id)

  if(!produk) {
    res.status(404).json({
      messages: "Data not found"
    })
  }

  res.status(200).json({
    messages: "Success Get Detail Data",
    data: produk
  })
})

//add produk
app.post('/produk', (req, res) => {
  const {nama, deskripsi, harga, stok} = req.body

  const id = produk_online.length + 1;

  const {error} = validasiproduk(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const image = req.files.image
  const filenamejoin = nama.split(" ").join("");
  const filename = `${filenamejoin}.jpg`

  image.mv(path.join(__dirname, 'public/images', filename))

  const newproduk = {
    id,
    nama,
    deskripsi,
    harga,
    stok,
    image: `/images/${filename}`,
  }

  produk_online.push(newproduk)

  res.status(201).json({
    messages: "Success add Data",
    data : newproduk
  })
})

//edit data produk
app.put('/produk/:id', (req, res) => {
  const id = req.params.id
  const {nama, deskripsi, harga, stok} = req.body

  const {error} = validasiproduk(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const produk = produk_online.find(produk => produk.id == id)

  if(!produk) {
    return res.status(404).json({
      messages: "Product not found"
    })
  }

  const fileNameOld = `${produk.nama}.jpg`
  produk.nama = nama
  produk.deskripsi = deskripsi
  produk.harga = harga
  produk.stok = stok
  
  const image = req.files.image

  if(image) {
    try{
      fs.unlinkSync(path.join(__dirname, 'public/images', fileNameOld))
    }catch(err){
    console.log(err)
    }
    const filename = `${nama}.jpg`
    image.mv(path.join(__dirname, 'public/images', filename))
    produk.image = `/images/${filename}`
  }

  res.status(201).json({
    messages:"Success Upadate Data",
    data: produk
  })

})

//delete produk
app.delete(`/produk/:id`, (req,res) => {
  const id = req.params.id

  const produk = produk_online.find(produk => produk.id == id)
  if(!produk){
    return res.status(404).json({
      messages:"Data not found"
    })
  }

  const index = produk_online.indexOf(produk)
  produk_online.splice(index, 1)

  res.status(200).json({
    messages:"Success Delete Data",
    data: produk
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

  const dataproduk = produk_online.find(produk => produk.id == id)

  if(!dataproduk){
    return res.status(404).json({
      message: "Data not found"
    })
  }

  const indexKeranjang = keranjang.findIndex(produk => produk.id == id);

  if (indexKeranjang != -1) {
    keranjang[indexKeranjang].total += total
    return res.status(200).json({
      message: "Total barang sudah diubah",
      data: keranjang
    })
  }

  keranjang.push({
    id: dataproduk.id,
    nama: dataproduk.nama,
    harga: dataproduk.harga,
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

  const indexKeranjang = keranjang.findIndex(produk => produk.id == id);
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

  const {error} = validasitotal(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const produk = keranjang.find(produk => produk.id == id)

  if(!produk) {
    return res.status(404).json({
      messages: "Data Not Found"
    })
  }

  produk.total = total

  res.status(201).json({
    messages: "Success Update Data",
    data: keranjang
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
