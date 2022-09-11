const Customer = require("../../view/customer")
const Credential = require("../../view/credential")
const JWTPayload = require('../../view/authentication.js');
const bcrypt = require('bcrypt');

async function login(req, resp)
{
    const userName = req.body.userName;
    const password = req.body.password;
    let [indexOfUser,isCustomerExist] = await Customer.findCustomer(userName);
    if(!isCustomerExist)
    {
        resp.status(401).send("No user Exists with this userName")
        return;
    }
    console.log(indexOfUser)
    let [isuserNameExist,credExist] = await Credential.findCredId(indexOfUser.credentials);
    if(!isuserNameExist)
    {
        resp.status(401).send("UserName Not Exist");
        return;
    }
    let isPassword = await bcrypt.compare(password, credExist.password);
    if(isPassword == false)
    {
        resp.status(401).send("Invalid Credentials")
        return;
    }
    const newPayload = new JWTPayload(indexOfUser)
    const newToken = newPayload.createToken();
    resp.cookie("mytoken",newToken)
    //,{
    //    expires:new Date(Date.now()+1*100000)
    //}
    resp.status(201).send(indexOfUser);
}

async function validCustomer(req,resp)
{
    const userName = req.params.userName;
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload == false)
    {
        resp.status(401).send("Login require");
        return;
    }
    if(newPayload.role != "customer" ){
        resp.status(401).send("Customer Login required")
        return;
    }
    let [isCredExist,cred] = await Credential.findCredId(newPayload.userName);
    if(cred.userName != userName ){
        resp.status(401).send("please login with correct userName")
        return;
    }
    resp.status(201).send("LoggedIN")
    return;
}

function validBanker(req,resp)
{
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "banker"){
        resp.status(401).send("please specify this role to banker")
        return;
    }
    resp.status(201).send("LoggedIN")
    return;
}

module.exports = {login,validBanker,validCustomer};