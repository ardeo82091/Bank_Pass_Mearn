import React, { useState,useEffect} from "react";
import axios from "axios";
import {useParams,useNavigate } from "react-router-dom";
import Navigation from '../navigation/navigation.js'
import '../customer/createcustomer.css'

function CustomerDashboard(){
    const role = "customer";
    const user = useParams().userName;
    const [loginStatus, updateloginStatus] = useState("")
    let navigate = new useNavigate();

    const navToLogin = () => {
        navigate('/');
      };

      useEffect(() => {
        axios.post(`http://localhost:8082/api/v1/isCustomerLogin/${user}`,{})
          .then((resp) => {
            updateloginStatus(true);
          })
          .catch((error) => {
            updateloginStatus(false);
          });
    }, []);

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
                    <Navigation userName={user} role={role} />
                    <hr/>
                </div> 
                    <div className="btn-group">
                            <div>
                            <a href={`deposit/${user}`}>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSlateGrey",width:"200%",height:"50%" }}>Deposit</button>
                            </a>
                            <hr/>
                            <a href={`withDraw/${user}`}>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSlateGrey",width:"200%",height:"50%" }}>WithDraw</button>
                            </a>  
                            <hr/>
                            <a href={`transfer/${user}`}>
                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSlateGrey",width:"200%",height:"50%",align:"right" }}>Transfer</button><br />
                            </a>
                            <hr/>
                            <a href={`allTransaction/${user}`}>
                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSlateGrey" ,width:"200%",height:"50%"}}>All Transactions</button><br />
                            </a>
                            </div>
                        </div>
                    </div>
        )
    }

}

export default CustomerDashboard;