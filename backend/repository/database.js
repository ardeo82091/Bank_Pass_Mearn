const mongoose = require('mongoose');
const customerModel = require('../model/customer')
const transactionModel = require('../model/transaction')
const credModel = require('../model/credential')
class DatabaseMongoose {
    constructor() {
        this._connect()
    }
    
    _connect() {
        mongoose.connect("mongodb://127.0.0.1:27017/Bank_Pass")
            .then(() => {
                console.log()
            })
            .catch(err => {
                console.error(err)
            })
    }


    async insertOneCustomer(user) {
        try {
            let newRecord = await customerModel.create(user)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async insertOneCred(cred) {
        try {
            let newRecord = await credModel.create(cred)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async insertOneTransaction(trans) {
        try {
            let newRecord = await transactionModel.create(trans)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }


    async findOneCustomer(customer){
        try {
            let newRecord = await customerModel.findOne(customer)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async findOneTransaction(trans){
        try {
            let newRecord = await transactionModel.findOne(trans)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async findOneCred(cred){
        try {
            let newRecord = await credModel.findOne(cred)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }


    async updateOneCustomer(customer,update){
        try {
            let newRecord = await customerModel.updateOne(customer,update)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async updateOneCred(cred,update){
        try {
            let newRecord = await credModel.updateOne(cred,update)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }


    async DeletOneCustomer(user){
        try {
            let newRecord = await customerModel.deleteOne(user)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }


    async getCustomerCred(iD) {
        try{
            let record = await customerModel.where("credential").equals(iD).populate("contacts.Object");
            return record;
        }
        catch (e) {
            console.log(e.message)
        }
    }


    async getCustomer() {
        try{
            let record = await customerModel.find().populate("credentials");
            return record;
        }
        catch (e) {
            console.log(e.message)
        }
        
    }

    async getTransaction(iD) {
        try{
            let record = await customerModel.where("credentials").equals(iD).populate("transaction.Object");
            return record;
        }
        catch (e) {
            console.log(e.message)
        }
        
    }
}







module.exports = {  DatabaseMongoose }