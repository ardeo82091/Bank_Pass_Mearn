import React,{useState,useEffect} from "react";
import axios from "axios";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {useNavigate,useParams} from "react-router-dom";
import Navigation from '../navigation/navigation'
import './updateCustomer.css';
function UpdateCustomer()
{
    const role = "banker";
    const user = useParams().user;
    const userName = useParams().userName;
    const [propertyToUpdate,updatepropertToUpdate] = useState("");
    const [value,updateValue] = useState("");
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

    const onUpdateUser = async (e) =>{
        e.preventDefault()
        await axios.put(`http://localhost:8082/api/v1/updateCustomer`,{userName,propertyToUpdate,value})
        .then((resp)=>{
            alert("Successfully Updated");
            updateStatusOfUser("Updated");
        })
        .catch((error)=>{
            alert(`Error ${error.response.data}`);
            updateStatusOfUser(error.response.message);
        })     
    }

    if (!loginStatus) {
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
                    <Navigation userName={user} role={role} />
                </div> 
                    <div className="container">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: "Tomato" }}>
                            <h5 style={{"textAlign": "center"}}>UPDATE USER</h5>
                            </div>
                            <div className="card-body" style={{ backgroundColor: "CadetBlue" }}>
                                <form onSubmit={onUpdateUser}>
                                <label  className="form-group">Property To be Update:</label><br />
                                <select className="form-control"
                                    onChange={(e) => {updatepropertToUpdate(e.target.value) }}>
                                    <option >Select</option>
                                    <option value="fullName">FullName</option>
                                    <option value="userName">UserName</option>
                                </select>
                                <br />
                                <label  className="form-group">Value To be Update:</label>
                                <input type= "text" className="form-control" value = {value}
                                    onChange={(e) => updateValue(e.target.value)} ></input><br />
                                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSlateGrey" }}>Update User</button><br />
                                    {StatusOfUser}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}
export  default UpdateCustomer;