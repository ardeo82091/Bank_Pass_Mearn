import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navigation/navigation";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SearchInput, { createFilter } from "react-search-input";
import './allCustomer.css';


function AllCustomer() {
    const User = useParams().userName
    const [allCustomer, updateallCustomer] = useState({});
    const [pageNumber, updatePageNumber] = useState(1);
    const [limit, updateLimit] = useState(5);
    const [loginStatus, updateloginStatus] = useState("")
    const [allCustomerCount, updateallCustomerCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    
    let navigate = new useNavigate();
    const navToLogin = () => {
      navigate('/');
    };
    
    const toggleCustomer = (e) => {
      let customerId = e.target.id;
      axios
        .post("http://localhost:8082/api/v1/deleteCustomer", { customerId })
        .then((resp) => {
          updateallCustomer(resp.data);
        })
        .catch((error) => {});
    };

    function getNumberOfCustomer() {
      axios
        .get("http://localhost:8082/api/v1/numberOfCustomer")
        .then((resp) => {
          console.log(resp.data)
          updateallCustomerCount(parseInt(resp.data));
        })
        .catch((error) => {});
    }

    useEffect(() => {
      axios.post("http://localhost:8082/api/v1/isBankerLogin",{})
        .then((resp) => {
          updateloginStatus(true);
        })
        .catch((error) => {
          updateloginStatus(false);
        });
        getCustomer();
        getNumberOfCustomer();
    }, [pageNumber, limit, allCustomer]);
  
    function getCustomer(){
      axios
        .post("http://localhost:8082/api/v1/getAllCustomer", { limit, pageNumber })
        .then((resp) => {
          updateallCustomer(resp.data);
          updateloginStatus(true);
        })
        .catch((error) => {
        });
      }
    
      const searchInputItem = (item) => {
        setSearchInput(item);
      };

    let rowOfUser;

    if (allCustomer != null) {
      let index=0;
      const filteredUsers = ["credentials.userName","fullName"];
      rowOfUser = Object.values(allCustomer).filter(createFilter(searchInput, filteredUsers)).map((u) => {
          index+=1;
            return (
              <tr id={u._id}>
                <td>{index}</td>
                <td>{u.credentials.userName}</td>
                <td>{u.fullName}</td>
                <td>{u.role}</td>
                <td id={u._id}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={u.isActive}
                          onChange={toggleCustomer}
                          id={u._id}
                        />
                      }
                    />
                  </FormGroup>
                </td>
                <td>{u.totalBalance}</td>
                <td>
                <a href={`updateCustomer/${User}/${u.credentials.userName}`}>
                  <button className="btn btn-primary"  style={{ backgroundColor: "DarkOlivegreen" }}>Update</button>
                  </a>
                </td>
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
                User not found, Click Below to login :
              </p>
              <button onClick={navToLogin} type="submit" className="btn btn-primary" style={{ backgroundColor: "green" ,fontSize : "30px"}}>Login</button><br />
            </div>
          </>
        );
      }
      return (
        <>
          <NavBar userName={User} role={"banker"} />
          <div>
          <SearchInput className="search-box" onChange={searchInputItem} />
            <div className="pagination">
              <label className="fw-bold" style ={{background : "Tomato"}}>limit:</label>
              <select
                id="role"
                name="role"
                onChange={(e) => {
                  updateLimit(e.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="pagination">
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(allCustomerCount/limit)}
                  color="primary"
                  onChange={(e, value) => updatePageNumber(value)}
                />
              </Stack>
            </div>
          </div>
          <div>
            <table className ="table table-striped">
              <thead style ={{background : "CadetBlue"}}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">FullName</th>
                  <th scope="col">Role</th>
                  <th scope="col">IsActive</th>
                  <th scope="col">TotalBalance</th>
                  <th scope="col">Update</th>
                </tr>
              </thead>
              <tbody>{rowOfUser}</tbody>
            </table>
          </div>
        </>
      );
}
export default AllCustomer;