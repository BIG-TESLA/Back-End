const keranjangService = require('../services/keranjang.service')

exports.keranjangProducController = async (req, res) => {
    console.log(req.body)
    const result = await keranjangService.createkeranjangProduct(req, res)
 
    return res.status(result.status).json(result)
}