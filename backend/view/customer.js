const Credential = require("./credential");
const Transaction = require("./transaction");
const {DatabaseMongoose} = require('../repository/database')
const bcrypt = require("bcrypt");
const uuid = require('uuid');
let id =0;
class Customer {
    constructor(fullName,credentials,role) {
        this.fullName = fullName;
        this.credentials= credentials;
        this.accountNo = "ACC00"+(id++);
        this.role = role;
        this.isActive = true;
        this.transaction = [];
        if(role=="customer"){
        this.totalBalance = 1000;
        }
        else if(role == "banker"){
            this.totalBalance=null;
        }
    }


    static async createNewCustomer(firstName, lastName,userName,password,role) 
    {
        let fullName = `${firstName} ${lastName}` 
        const [flag,message,newCredential] = await Credential.createCredential(userName,password);
        if(flag === false)
        {
            return [null,"UserName already Exists"]
        }
        const db = new DatabaseMongoose();
        let newCustomer = await db.insertOneCustomer( new Customer(fullName,newCredential,role));
        return [newCustomer," Customer created Successfully"]
    }

    static async createBankManager(firstName, lastName,userName,password) 
    {
        let fullName = `${firstName} ${lastName}` 
        const [flag,message,newCredential] =await Credential.createCredential(userName,password);
        if(flag === false)
        {
            return ;
        }
        const role = "banker";
        const db = new DatabaseMongoose();
        let ans = await db.insertOneCustomer(new Customer(fullName,newCredential,role));
        return ;
    }

    static async findCustomer(userName) 
    {
        const db = new DatabaseMongoose();
        const findCred =await db.findOneCred({"userName":userName});
        if(!findCred)
        {
            return [-1,false];
        }
        const findUser = await db.findOneCustomer({"credentials":findCred._id})
        if(findUser && findUser.isActive == true)
        {
            return [findUser,true];
        }
        return [-1,false];
    }

    static async allCustomers()
    {
        const db = new DatabaseMongoose();
        const allCstomers = await db.getCustomer();
        return allCstomers;
    }

    static async allTransactions(iD)
    {
        const db = new DatabaseMongoose();
        const findtrans = await db.getTransaction(iD);
        const allTransactions= [];
        for(let index = 0; index<findtrans[0].transaction.length; index++)
        {
            let findtransaction = await db.findOneTransaction({"_id":findtrans[0].transaction[index]})
            allTransactions.push(findtransaction)
        }
        return allTransactions.reverse();
    }

    static findAccount(account) {
        if(Customer.allCustomers.length == 0) return [-1,false];
        for (let index = 0; index < Customer.allCustomers.length; index++) {
            if (Customer.allCustomers[index].accountNo == account) {
                return [index, true];
            }
        }
        return [-1, false];
    }

    static async isCustomerIdExists(customerId)
    { 
        const db = new DatabaseMongoose();
        const findUser =await db.findOneCustomer({"_id":customerId});
        if(findUser)
        {
            return [findUser,true];
        }
        return [-1,false];
    }

    async comparePassword(password)
    {
        let isPasswordMatch = await bcrypt.compare(password,this.credentials.password);
        return isPasswordMatch;
    }

    static async updateCustomerActive(isactive,userId)
    {
        const db = new DatabaseMongoose();
        await db.updateOneCustomer({_id:userId},{$set:{isActive:isactive}})
        return ;
    }

    static async updatetotalBalance(userName) {
        const db = new DatabaseMongoose();
        let [findCustomer,isCustomerExists] = await Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [false,"Customer not Exists"];
        }
        if(findCustomer.transaction.length == 0)
        {
            findCustomer.totalBalance = 1000;
        }
        let trans_id = findCustomer.transaction[findCustomer.transaction.length - 1];
        let findtotalBalance = await db.findOneTransaction({"_id":trans_id});
        let update = await db.updateOneCustomer({"_id":findCustomer._id},{$set:{"totalBalance":findtotalBalance.totalAmount}});
        return [true,"updated"]
    }

    static async withdraw(amount,userName)
    {
        const db = new DatabaseMongoose();
        let [findCustomer,isCustomerExists] = await Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [false,"Customer not Exists"];
        }
        if(findCustomer.totalBalance-amount<1000)
        {
            return [false, "Not Sufficient Balance"];
        }
        let newTrans = new Transaction("self", amount, "debit", findCustomer.totalBalance)
        const newTransaction = await db.insertOneTransaction(newTrans);
        await db.updateOneCustomer({_id:findCustomer._id},{$push:{transaction:newTransaction}})
        await Customer.updatetotalBalance(userName);
        return [true, "Successfull Withdraw"];
    }

    static async deposit(amount,userName)
    {
        const db = new DatabaseMongoose();
        let [findCustomer,isCustomerExists] = await Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [false,"Customer not Exists"];
        }
        let newTrans = new Transaction("self", amount, "credit", findCustomer.totalBalance)
        const newTransaction = await db.insertOneTransaction(newTrans);
        await db.updateOneCustomer({_id:findCustomer._id},{$push:{transaction:newTransaction}})
        await Customer.updatetotalBalance(userName);
        return [true, "Successfull Deposit"];
    }

    static async transfer(amount, creditAccount,userName)
    {
        const db = new DatabaseMongoose();
        let [findCustomer,isCustomerExists] = await Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [false,"Customer not Exists"];
        }
        if(findCustomer.totalBalance-amount<1000)
        {
            return [false, "Not Sufficient Balance"];
        }
        let newTrans = new Transaction(creditAccount, amount, "transfer", findCustomer.totalBalance)
        const newTransaction = await db.insertOneTransaction(newTrans);
        await db.updateOneCustomer({_id:findCustomer._id},{$push:{transaction:newTransaction}})
        await Customer.updatetotalBalance(userName);

        let [findCustomer1,isCustomerExists1] = await Customer.findCustomer(creditAccount);
        if(!isCustomerExists1 || findCustomer1.role == "banker")
        {
            let newTrans = new Transaction("failed-transaction", amount, "credit", (findCustomer.totalBalance-amount))
            const newTransaction = await db.insertOneTransaction(newTrans);
            await db.updateOneCustomer({_id:findCustomer._id},{$push:{transaction:newTransaction}})
            await Customer.updatetotalBalance(userName);
            return [false,"Deposit Fail!! ,Account not Exists"];
        }
        let tAmount = findCustomer1.totalBalance;
        let newTransaction2 = await db.insertOneTransaction(new Transaction(userName , amount, "credit", tAmount));
        await db.updateOneCustomer({_id:findCustomer1._id},{$push:{transaction:newTransaction2}})
        await Customer.updatetotalBalance(creditAccount);
        return [true, "Successfully Transfer"];

    }

    static async update(userName,propertyToUpdate, value)
    {
        let [dUser,isUserExist] = await Customer.findCustomer(userName);
        if(!isUserExist)
        {
            return [false,"User Not Exist"];
        }
        const db = new DatabaseMongoose();
        switch (propertyToUpdate) 
        {
            case "fullName": 
            await db.updateOneCustomer({"_id":dUser._id},{$set:{fullName:value}})
            return [true,"Updated"];
            
            case "userName":
                await db.updateOneCred({"_id":dUser.credentials},{$set:{userName:value}}) 
                return [true,"Updated"];

            default: return [false,"Not Updated"];
        }
    }

}

module.exports = Customer;