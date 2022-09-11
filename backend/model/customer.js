const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    fullName : {type:String},
    accountNo : {type:String},
    credentials: { type: mongoose.SchemaTypes.ObjectId,ref:"Credentials"},
    role : {type:String},
    isActive:{type:Boolean},
    transaction :{type:[mongoose.SchemaTypes.ObjectId],ref:"Transaction"},
    totalBalance :{type:Number}
},{
    timestamps:true
})

let customerModel = new mongoose.model('Customer', CustomerSchema)
module.exports = customerModel;