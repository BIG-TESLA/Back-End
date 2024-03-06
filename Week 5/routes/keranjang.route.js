var express = require('express');
const keranjangController = require('../controllers/keranjang.controller');
var router = express.Router();

router.post('/', keranjangController.keranjangProducController)

module.exports = router;