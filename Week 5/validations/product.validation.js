const joi = require('joi')

//validate tambah product
const validateproduct = (product) => {
    const schema = joi.object({
      nama: joi.string().min(3).required(),
      deskripsi: joi.string().min(3).required(),
      harga: joi.number().required(),
      stok: joi.number().required(),
    })
  
    return schema.validate(product)
  }
  