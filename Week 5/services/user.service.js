const {user} = require('../models')   

exports.getAllUsers = async (req, res) => {

    const data = await user.findAll()

    return {
        status: 200,
        data,
        message: "Success Get All Data"
    }
} 

exports.getDetailUser = async (req, res) => {
    const {id} = req.params

    const data = await user.findOne({where: {id}})

    if(!data){
        return {
            status: 404,
            message: "Data Not Found"
        }
    }

    return {
        status: 200,
        data,
        message: "Success Get Detail Data"
    }
}

