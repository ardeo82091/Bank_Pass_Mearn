const Customer = require("../../view/customer")
const JWTPayload = require('../../view/authentication.js');


async function createBankManager()
{
    await Customer.createBankManager("Ankit","Raj","ankit","ankit@123");
    return;
}

async function createCustomer(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to banker")
        return;
    }
    if (newPayload.isActive == false){
        resp.status(401).send(`${newPayload.firstName} is Inactive`)
        return;
    }

    let {firstName, lastName,userName,password,role} = req.body;

    if (typeof firstName != "string") {
        resp.status(406).send("FIrst Name is invalid");
        return;
    }

    if (typeof lastName != "string") {
        resp.status(406).send("LastName is invalid");
        return;
    }    
    
    if (typeof userName != "string") {
        resp.status(406).send("userName is invalid");
        return;
    }

    if (typeof password != "string") {
        resp.status(406).send("password is invalid");
        return;
    }

    let [newCustomer,message] = await Customer.createNewCustomer(firstName, lastName,userName,password,role);
    if(newCustomer== null)
    {
        resp.status(403).send(message);
        return;
    }
    resp.status(201).send(newCustomer);
    return;
}

async function getAllCustomer(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to banker")
        return;
    }
    if (newPayload.isActive == false){
        resp.status(401).send(`${newPayload.firstName} is Inactive`)
        return;
    }
    const { limit, pageNumber } = req.body;
    let allUser = await Customer.allCustomers();
    if (allUser.length == 0) {
        return resp.status(403).send("No user Exist");
    }
    let startIndex = (pageNumber - 1) * limit;
    let endIndex = pageNumber * limit;
    resp.status(201).send(allUser.slice(startIndex,endIndex));
    return;
}

async function numberOfCustomer(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to banker")
        return;
    }
    if (newPayload.isActive == false){
        resp.status(401).send(`${newPayload.firstName} is Inactive`)
        return;
    }
    let allUser = await Customer.allCustomers();
    resp.status(201).send(allUser.length.toString());
    return;
}

async function deleteCustomer(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to Banker")
        return;
    }
    const customerId = req.body.customerId;
    let [customere, isCustomerExists] = await Customer.isCustomerIdExists(customerId);
    if(!isCustomerExists)
    {
        resp.status(403).send("User not Found");
        return;
    }
    console.log(customere._id,"{}{}{}{");
    (customere.isActive == true)? (customere.isActive = false) : (customere.isActive = true);
    await Customer.updateCustomerActive(customere.isActive,customere._id);
    resp.status(201).send("Updated");
    return;
}

async function updateCustomer(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to Banker")
        return;
    }
    if (newPayload.isActive == false){
        resp.status(401).send(`${newPayload.firstName} is Inactive`)
        return;
    }
    let userName = req.body.userName;
    let {propertyToUpdate,value} = req.body;

    if (typeof propertyToUpdate != "string") {
        resp.status(406).send("popertyToUpdate is invalid");
        return;
    }

    if (typeof value != "string") {
        resp.status(406).send("value is invalid");
        return;
    }

    const [isUpdate,msz] = await Customer.update(userName,propertyToUpdate,value);
    if(!isUpdate){
        resp.status(403).send("Customer not Updated")
        return;
    }
    resp.status(201).send("updated");
    return;
}

module.exports = {createBankManager,createCustomer,getAllCustomer,numberOfCustomer,deleteCustomer,updateCustomer};