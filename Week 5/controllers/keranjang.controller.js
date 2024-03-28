const keranjangService = require('../services/keranjang.service')

exports.keranjangProducController = async (req, res) => {
    console.log(req.body)
    const result = await keranjangService.createkeranjangProduct(req, res)
 
    return res.status(result.status).json(result)
}

exports.keranjangNotificationController = async (req, res) => {

    const result = await keranjangService.keranjangNotification(req,res)

    return res.status(result.status).json(result)

}