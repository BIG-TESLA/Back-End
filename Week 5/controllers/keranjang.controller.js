const keranjangService = require('../services/keranjang.service')

exports.keranjangProducController = async (req, res) => {
 
    const result = await keranjangService.createKeranjangtProduct(req, res)
 
    return res.status(result.status).json(result)
}