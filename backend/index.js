const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser')
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

const { createBankManager,createCustomer, getAllCustomer, numberOfCustomer, deleteCustomer ,updateCustomer} = require('./Controllers/Customer/controller');
const {login,validBanker,validCustomer} = require('./Controllers/Login/controller');
const {deposit,withDraw,transfer,getAllTransactions,NumberOfTransactions} = require('./Controllers/Transaction/controller');
const logout = require('./Controllers/Logout/controller');

app.post("/api/v1/login", async (req,resp)=>login(req,resp));

app.post("/api/v1/createCustomer",async (req, resp)=>createCustomer(req,resp));

app.put("/api/v1/updateCustomer",(req,resp)=>updateCustomer(req,resp));

app.post("/api/v1/deleteCustomer", (req, resp) => deleteCustomer(req, resp));

app.post("/api/v1/getAllCustomer",(req, resp)=>getAllCustomer(req,resp));

app.get("/api/v1/numberOfCustomer",(req, resp)=>numberOfCustomer(req,resp));

app.post("/api/v1/withDraw/:userName",(req,resp)=>withDraw(req,resp));

app.post("/api/v1/deposit/:userName",(req,resp)=>deposit(req,resp));

app.post("/api/v1/transfer/:debitCustomer",(req,resp)=>transfer(req,resp));

app.post("/api/v1/getAllTransaction/:userName",(req, resp)=>getAllTransactions(req,resp));

app.get("/api/v1/numberOfTransaction/:userName",(req, resp)=>NumberOfTransactions(req,resp));

app.post("/api/v1/isBankerLogin",(req,resp)=>validBanker(req,resp));

app.post("/api/v1/isCustomerLogin/:userName",(req,resp)=>validCustomer(req,resp));

app.post("/api/v1/logout",(req,resp)=>logout(req,resp));


app.listen(8082,async ()=>{
    await createBankManager();
    console.log("app is started at port 8082");
})