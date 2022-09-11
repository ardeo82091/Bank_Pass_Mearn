const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    creditedTo : {type:String},
    amountp : {type:String},
    amountn : {type:String},
    type : {type:String},
    totalAmount : {type:String}
},{
    timestamps:true
})

let transactionModel = new mongoose.model('Transaction', TransactionSchema)
module.exports = transactionModel;