import React from "react"; 
import { Link } from "react-router-dom";
import styled from "styled-components";
import Burger from "./Burger";
import Logo from "../Logo/Logo";

const Nav = styled.nav`
    width: 100%;
    height: 55px; 
    border-bottom: 2px solid #f1f1f1; 

    padding-right: 20px;
    display: flex; 
    gap: 2rem;

    .logoNavbar {
        
    }
`

    

const Navbar = () =>{
    return(
        <Nav>
            <div className="logoNavbar ">
                <Logo size="navbar"/> 
            </div>
            <Burger />
        
        </Nav>
    )
}

export default Navbar