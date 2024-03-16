const joi = require('joi')

//validate tambah product
exports.validateAddProduct = (product) => {
    const schema = joi.object({
      name: joi.string().min(3).required(),
      price: joi.number().required(),
      description: joi.string().min(3).required(),
      category: joi.string().min(3).required(),
      stock: joi.number().required(),
    })
  
    return schema.validate(product)
  }
  
exports.validateEditProduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    price: joi.number().required(),
    description: joi.string().min(3).required(),
    category: joi.string().min(3).required(),
    stock: joi.number().required(),
  })

  return schema.validate(product)
}