import React from 'react'
import styled from 'styled-components'

const Ul = styled.ul`
    list-style:none; 
    display: flex; 
    flex-flow: row nowrap;
    font-family: "DM Serif Text", "Roboto", "Open Sans", sans-serif;
    font-weight: 400;
    font-size: 15.2px;
    color: white;
    gap: 3rem; 

    li{
        padding: 18px 10px;
    }

    /* Define different colors for each item */
    li:nth-child(1) {
        color: #ff6347; /* Orange */
    }
    li:nth-child(2) {
        color: #4caf50; /* Green */
    }
    li:nth-child(3) {
        color: #2196f3; /* Blue */
    }
    li:nth-child(4) {
        color: #ffeb3b; /* Yellow */
    }
    li:nth-child(5) {
        color: #9c27b0; /* Purple */
    }

    @media (max-width: 768px){
        flex-flow:column nowrap; 
        background-color: rgb(36, 35, 35); 
        position: fixed; 
        top: ${({ open }) => open ? '55px' : '-100vh'};
        right: 0; 
        height: 100vh; 
        width: 300px; 
        padding-top: 3.5rem;
        transition: top 0.7s ease-in-out, transform 1s ease-in-out;
        font-family: "Open Sans";
        font-weight: 800;
        font-size: 22px;
        gap: 1rem;

        transform: ${({open}) => open ? 'translateY(0)': 'translateY(-100%)'};
        
        

        li{
            color: #fff;
            border-color: white;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
    }
`;

const RightNav = ({open}) => {
    return (
        <Ul open={open}>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Sign In</li>
            <li>Sign Up</li>
        </Ul>
    )
}

export default RightNav
