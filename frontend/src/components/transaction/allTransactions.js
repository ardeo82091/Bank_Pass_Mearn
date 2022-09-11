import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navigation/navigation";
import { DownloadTableExcel } from "react-export-table-to-excel";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


function AllTransaction() {
    const User = useParams().userName
    const tableRef = useRef();
    const [allTransaction, updateallTransaction] = useState({});
    const [pageNumber, updatePageNumber] = useState(1);
    const [limit, updateLimit] = useState(5);
    const [loginStatus, updateloginStatus] = useState("")
    const [allTransactionCount, updateallTransactionCount] = useState(0);
    let navigate = new useNavigate();
    const navToLogin = () => {
      navigate('/');
    };

    function getNumberOfCustomer() {
      axios
        .get(`http://localhost:8082/api/v1/numberOfTransaction/${User}`)
        .then((resp) => {
          updateallTransactionCount(parseInt(resp.data));
        })
        .catch((error) => {});
    }

    useEffect(() => {
        axios.post(`http://localhost:8082/api/v1/isCustomerLogin/${User}`,{})
          .then((resp) => {
            updateloginStatus(true);
          })
          .catch((error) => {
            updateloginStatus(false);
          });
        getCustomer();
        getNumberOfCustomer();
    }, [pageNumber, limit, allTransaction]);
  
    function getCustomer(){
      axios
        .post(`http://localhost:8082/api/v1/getAllTransaction/${User}`, { limit, pageNumber })
        .then((resp) => {
          updateallTransaction(resp.data);
          updateloginStatus(true);
        })
        .catch((error) => {
        });
      }
    
    let rowOfUser;

    if (allTransaction != null) {
      let index=0;
        rowOfUser = Object.values(allTransaction).map((u) => {
          index+=1;
            return (
              
              <tr>
                <td>{index}</td>
                <td>{u.type}</td>
                <td>{u.amountp}{u.amountn} <h6 style ={{background : "green",color:"white"}}>{u.amountp}</h6>
                <h6 style ={{background : "red",color:"white"}}>{u.amountn}</h6></td>
                <td><h6>{u.creditedFrom} </h6>
                <h6>{u.creditedTo} </h6>
                </td>
                <td>{u.totalAmount}</td>
                <td>
                {u.updatedAt.split("T")[0].split("-").reverse().join("-")}
                </td>
                <td>{u.updatedAt.split("T")[1].split(".")[0]}</td>
              </tr>
            );
          });
        }
    if (!loginStatus) {
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
        );
      }
      return (
        <>
          <NavBar userName={User} role={"customer"} />
          <div>
            <div className="pagination">
              <label className="fw-bold" style={{backgroundColor: "Tomato"}}>limit:</label>
              <select
                id="role"
                name="role"
                onChange={(e) => {
                  updateLimit(e.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
            <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <button type="button" style={{background:"green",float: "right"}} className="btn btn-primary">GET EXCEL SHEET</button>
          </DownloadTableExcel>
            
            <div className="pagination">
              <Stack spacing={2}>
                <Pagination
                
                  count={Math.ceil(allTransactionCount/limit)}
                  color="primary"
                  onChange={(e, value) => updatePageNumber(value)}
                />
              </Stack>
            </div>
          </div>
          <div>
            <table className ="table table-striped"  ref={tableRef}>
              <thead style ={{background : "CadetBlue"}}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">TO /From</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">DATE</th>
                  <th scope="col">TIME</th>
                </tr>
              </thead>
              <tbody>{rowOfUser}</tbody>
            </table>
          </div>
        </>
      );
}
export default AllTransaction;