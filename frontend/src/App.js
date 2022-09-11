// import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from 'react-router-dom'
import Login from './components/login/login';
import BankerDashboard from './components/bankerDashboard/dashboard';
import CustomerDashboard from './components/customerDashboard/customerDashboeard'
import CreateCustomer from './components/customer/createCustomer';
import AllCustomer from './components/customer/allCustomer';
import UpdateCustomer from './components/customer/updateCustomer'; 
import Deposit from './components/transaction/deposit';
import WithDraw from './components/transaction/withDraw';
import Transfer from './components/transaction/transfer';
import AllTransaction from './components/transaction/allTransactions';

function App() {
  return (

  <Routes>
    <Route exact path='/bankerDashboard/:userName' element={<BankerDashboard/>} />
    <Route exact path='/CreateCustomer/:userName' element={<CreateCustomer />} />
    <Route exact path='/AllCustomer/:userName' element={<AllCustomer />} />
    <Route exact path='/AllCustomer/updateCustomer/:user/:userName' element={<UpdateCustomer />} />
    <Route exact path='/customerDashboard/:userName' element={<CustomerDashboard />} />
    <Route exact path='/customerDashboard/deposit/:userName' element={<Deposit />} />
    <Route exact path='/customerDashboard/withDraw/:userName' element={<WithDraw/>} />
    <Route exact path='/customerDashboard/transfer/:userName' element={<Transfer/>} />
    <Route exact path='/customerDashboard/allTransaction/:userName' element={<AllTransaction/>} />
    <Route exact path='/' element={<Login />} />
  </Routes>
  
  )
}

export default App;
