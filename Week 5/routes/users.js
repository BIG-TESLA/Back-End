// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller')

router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.put('/:id', userController.editUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getDetailUser)

module.exports = router;