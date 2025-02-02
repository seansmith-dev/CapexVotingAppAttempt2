import React from "react"; 
import styled from "styled-components";
import Burger from "./Burger.js";
import Logo from "../Logo/Logo.js";

const Nav = styled.nav`
    width: 100%;
    background-color: black; 
    display: flex; 
    padding-right: 2rem; 
    gap: 2rem;


    @media (min-width: 600px){
        padding: 0 2rem; 
    }

    .logoNavbar {
        
    }

`

    

const Navbar = () =>{
    return(
        <Nav>
                <Logo size="navbar"/> 
            <Burger />
        
        </Nav>
    )
}

export default Navbar