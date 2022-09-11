import React, { useState,useEffect} from "react";
import axios from "axios";
import {useParams,useNavigate } from "react-router-dom";
import Navigation from '../navigation/navigation.js'
import './createcustomer.css';
function CreateCustomer() 
{
    const roleOfBanker = "banker"
    const userNameofBanker = useParams().userName;
    const [firstName,updateFirstName] = useState("");
    const [lastName,updateLastName] = useState("");
    const [userName,updateUserName] = useState("");
    const [password,updatePassword] = useState("");
    const [role,updateRole] = useState("");
    const [loginStatus, updateloginStatus] = useState("")
    const [StatusOfUser,updateStatusOfUser] = useState("");
    
    let navigate = new useNavigate();
    const navToLogin = () => {
        navigate('/');
      };

    useEffect(() => {
        axios.post("http://localhost:8082/api/v1/isBankerLogin",{})
          .then((resp) => {
            updateloginStatus(true);
          })
          .catch((error) => {
            updateloginStatus(false);
          });
    }, []);

    const handleMySubmit = async (e) => {
            e.preventDefault();
            
            await axios.post("http://localhost:8082/api/v1/createCustomer",{firstName,lastName,userName,password,role})
            .then((resp)=>{
                alert("Successfully Created");
                updateStatusOfUser("Created");
            })
            .catch((error)=>{
                alert(`Error ${error.response.data}`);
                updateStatusOfUser(error.response.message);
            })            
    }
    if (loginStatus === false) {
        console.log(loginStatus)
        return (
            <>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white", fontSize: "30px" , background : "red"}}>
                User not logged in, Click Below to login :
              </p>
              <button onClick={navToLogin} type="submit" className="btn btn-primary" style={{ backgroundColor: "green" ,fontSize : "30px"}}>Login</button><br />
            </div>
          </>
        )
    }
    else {
        return (
            <div>
                <div >
                    <Navigation userName={userNameofBanker} role={roleOfBanker} />
                </div> 
                    <div className="container">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: "Tomato" }}>
                                <h5 style={{"textAlign": "center"}}>CREATE CUSTOMER</h5>
                            </div>
                                  <div className="card-body" style={{ backgroundColor: "CadetBlue" }}>
                                  <form onSubmit={handleMySubmit}>
                                    <label  className="form-group">FirstName :</label>
                                    <input type= "text" placeholder="FirstName" className="form-control" value = {firstName}
                                    onChange={(e) => updateFirstName(e.target.value)} ></input><br />
                                    <label  className="form-group">LastName :</label>
                                    <input type= "text" placeholder="LastName" className="form-control" value = {lastName}
                                    onChange={(e) => updateLastName(e.target.value)} ></input><br />
                                    <label  className="form-group">UserName :</label>
                                    <input type= "text" placeholder="UserName" className="form-control" value = {userName}
                                    onChange={(e) => updateUserName(e.target.value)} ></input><br />
                                    <label  className="form-group">Password :</label>
                                    <input type= "text" placeholder="Password" className="form-control" value = {password}
                                    onChange={(e) => updatePassword(e.target.value)} ></input><br />
                                    <label  className="form-group">Role :</label><br />
                                    <select className="form-control"
                                      onChange={(e) => {updateRole(e.target.value) }}>
                                      <option >Select</option>
                                      <option value="customer">Customer</option>
                                      <option value="banker">Admin</option>
                                    </select>
                                    <br/>
                                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSLateGray" }}>Create Customer</button><br />
                                    {StatusOfUser}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}
export default CreateCustomer;