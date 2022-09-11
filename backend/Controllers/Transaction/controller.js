const Customer = require("../../view/customer")
const JWTPayload = require('../../view/authentication.js');
const Credential = require('../../view/credential');

async function deposit(req,resp)
{
    let userName = req.params.userName;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload==false){
        resp.status(401).send("Login require")
        return;
    }    
    if(newPayload.role != "customer"){
        resp.status(401).send("Login with your Customer Id")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != userName ){
        resp.status(401).send("please login with correct userName")
        return;
    }
    let amount = req.body.amount;

    if (typeof amount != "number") {
        resp.status(406).send("Amount is invalid");
        return;
    } 

    let [indexOfCustomer,isCustomerExists] = await Customer.findCustomer(userName);
    if(!isCustomerExists)
    {
        resp.status(403).send("Not find any Customer with this username");
        return;
    }
    let [isAccountExists,message]= await Customer.deposit(amount,userName);
    if(!isAccountExists)
    {
        resp.status(403).send(message);
        return;
    }
    resp.status(201).send(message);
    return;
}

async function withDraw(req,resp)
{
    let userName = req.params.userName;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload==false){
        resp.status(401).send("Login require")
        return;
    }    
    if(newPayload.role != "customer"){
        resp.status(401).send("Login with your Customer Id")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != userName ){
        resp.status(401).send("please login with correct userName")
        return;
    }
    let amount = req.body.amount;

    if (typeof amount != "number") {
        resp.status(406).send("Amount is invalid");
        return;
    } 

    let [indexOfCustomer,isCustomerExists] =await  Customer.findCustomer(userName);
    if(!isCustomerExists)
    {
        resp.status(403).send("Not find any Customer with this username");
        return;
    }
    let [isAccountExists,message]= await Customer.withdraw(amount,userName);
    if(!isAccountExists)
    {
        resp.status(403).send(message);
        return;
    }
    resp.status(201).send(message);
    return;
}

async function transfer(req,resp)
{
    let debitCustomer = req.params.debitCustomer;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload==false){
        resp.status(401).send("Login require")
        return;
    }    
    if(newPayload.role != "customer"){
        resp.status(401).send("Login with your Customer Id")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != debitCustomer ){
        resp.status(401).send("please login with correct userName")
        return;
    }
    let {amount,creditCustomer} = req.body;

    if (typeof amount != "number") {
        resp.status(406).send("Amount is invalid");
        return;
    }

    if (typeof creditCustomer != "string") {
        resp.status(406).send("crditCustomer is invalid");
        return;
    } 
    let [indexOfCustomer,isCustomerExists] =await  Customer.findCustomer(debitCustomer);
    if(!isCustomerExists)
    {
        resp.status(403).send("Not find any Customer with this username");
        return;
    }
    let [isAccountExists,message]=await Customer.transfer(amount, creditCustomer,debitCustomer);
    if(!isAccountExists)
    {
        resp.status(403).send(message);
        return;
    }
    resp.status(201).send(message);
    return;
}

async function getAllTransactions(req,resp)
{
    let userName = req.params.userName;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload==false){
        resp.status(401).send("Login require")
        return;
    }    
    if(newPayload.role != "customer"){
        resp.status(401).send("Login with your Customer Id")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != userName ){
        resp.status(401).send("please login with correct userName")
        return;
    }

    let [indexOfCustomer,isCustomerExists] = await Customer.findCustomer(userName);
    if(!isCustomerExists)
    {
        resp.status(403).send("Not find any Customer with this username");
        return;
    }
    let AllTransaction = await Customer.allTransactions(cred._id);
    if (AllTransaction.length == 0) {
        return resp.status(403).send("No user Exist");
    }
    const { limit, pageNumber } = req.body;
    let startIndex = (pageNumber - 1) * limit;
    let endIndex = pageNumber * limit;
    resp.status(201).send(AllTransaction.slice(startIndex,endIndex))
    return;
}

async function NumberOfTransactions(req,resp)
{
    let userName = req.params.userName;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload==false){
        resp.status(401).send("Login require")
        return;
    }    
    if(newPayload.role != "customer"){
        resp.status(401).send("Login with your Customer Id")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != userName ){
        resp.status(401).send("please login with correct userName")
        return;
    }

    let [indexOfCustomer,isCustomerExists] = await Customer.findCustomer(userName);
    if(!isCustomerExists)
    {
        resp.status(403).send("Not find any Customer with this username");
        return;
    }
    let AllTransaction = await Customer.allTransactions(cred._id);
    resp.status(201).send(AllTransaction.length.toString());
    return;

}

module.exports = {deposit,withDraw,transfer,getAllTransactions,NumberOfTransactions};