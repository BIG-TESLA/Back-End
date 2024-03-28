var express = require('express');
const keranjangController = require('../controllers/keranjang.controller');
const { tes, auth } = require('../middleware/index.middleware');
var router = express.Router();

router.post('/', auth, keranjangController.keranjangProducController)
router.post('/notification', keranjangController.keranjangNotificationController)


module.exports = router;