const { rupiahFormat } = require('../helpers/rupiahFormat.helper')
const { keranjang, products } = require('../models')

const midtransClient = require('midtrans-client');
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-JU3ec8ADVK7gmmRKQg9Wr-Xx',
        clientKey : 'SB-Mid-client-i-ZYSv50IwQBM3GA'
    });

exports.createkeranjangProduct = async (req, res) => {
    
    const {id_product, quantity, bank} = req.body

    const id_user = req.user_data.id

    const product = await products.findOne({where: {id: id_product}})

    if(!product){
        return {
            status: 404,
            message: "Product yang ingin kamu beli tidak ditemukan"
        }
    }

    const random = Math.floor(Math.random() * 1000)

    const dataMidtrans = {
        "payment_type": "bank_transfer",
        "transaction_details": {
            "order_id": `order-${random}`,
            "gross_amount": quantity * product.price
        },
        "items_details":[
            {
                "id": product.id,
                "price": product.price,
                "quantity": quantity,
                "name": product.name,
            }
        ],
        "bank_transfer":{
            "bank": `${bank}`
        },
        "customer_details": {
            "first_name": req.user_data.name,
            "last_name": req.user_data.name,
            "email": req.user_data.email,
        }
    }

      let transactionToken = await coreApi.charge(dataMidtrans)

      console.log(transactionToken)


    let data = await keranjang.create(
        {
            order_id: `order-${random}`,
            id_user,
            id_product,
            quantity,
            status: "pending",
            va_number: transactionToken.va_numbers[0].va_number
        }
    )
    
    data.dataValues.total = rupiahFormat(quantity * product.price)

    console.log(data)

    return {
        status: 201,
        data,
        message: "Success Create Data"
    }

}

exports.keranjangNotification = async (req, res) => {
    let midtransNotif = await coreApi.transaction.notification(req.body)

    console.log(midtransNotif)

    keranjang.update({
        status: midtransNotif.transaction_status
    },{
        where: {
            order_id: midtransNotif.order_id
        }
    })
    return {
        status: 200,
        message: "Success create data"
    }
}
