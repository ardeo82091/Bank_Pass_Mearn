import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useNavigate} from "react-router-dom";
import axios from "axios";
import img from '../../unnamed.png'
import  './navigation.css'
function Navigation({ userName, role }) {
    let navigate = new useNavigate();
    const handleMyLogout = () => {
        axios.post('http://localhost:8082/api/v1/logout').then((resp)=> {
            navigate('/');
        });
    };
    const navigateToHome = () => {
            navigate(`/customerDashboard/${userName}`);
    };

    if (role === "banker") {
        const createCustomerPath = "/CreateCustomer/" + userName
        const allCustomerPath = "/AllCustomer/" + userName

        return (

            <Navbar collapseOnSelect expand="lg" bg="" variant = "light" style={{background : "Bisque"}}>
                <Container>
                    <Navbar.Brand href="/">
                        <img src={img} className = "img" alt = "logo"></img> &nbsp;
                        {userName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">

                            <NavDropdown title="CUSTOMER"  id="basic-nav-dropdown">
                                <NavDropdown.Item href={createCustomerPath} >Create</NavDropdown.Item>
                                <NavDropdown.Divider style={{background : "grey"}}/>
                                <NavDropdown.Item href={allCustomerPath} >All Customer</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>        
                    </Navbar.Collapse>
                    <a className="nav navbar-nav">
                        <button className="btn btn-primary" onClick={handleMyLogout} style={{ backgroundColor: "orange" ,float: "right"}}>Logout</button>
                                
                            </a>
                </Container>
            </Navbar>
        )
    } else {
        return (

            <Navbar collapseOnSelect expand="lg" bg="" variant="light" style={{background : "Bisque"}}>
                <Container>
                    <Navbar.Brand href="/">
                        <img src={img} className = "img" alt = "logo" onClick={navigateToHome}></img> &nbsp;
                        {userName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">

                        </Nav>
                    </Navbar.Collapse>
                    <a className="nav navbar-nav">
                        <button className="btn btn-primary" onClick={handleMyLogout} style={{ backgroundColor: "orange" ,float: "right"}}>Logout</button>
                                
                            </a>
                </Container>
            </Navbar>
        )
    }

}
export default Navigation
