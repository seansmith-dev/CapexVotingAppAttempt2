import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import styled from 'styled-components';

const Ul = styled.ul`
    
    align-self: center; 
    display: flex; 
    flex-flow: row nowrap;
    font-family: "DM Serif Text", "Roboto", "Open Sans", sans-serif;
    font-weight: 900;
    font-size: 1.2rem;
    color: white;
    gap: 4rem; 
    list-style:none; 
    z-index: 1000;

    .nav__item{
        font-weight: 900;
        font-size: 1.5rem;
        transform: scale(1);
        transition: transform 250ms;
        letter-spacing: 1px;  
    }

    /* Define different colors for each item */
    .nav__item:nth-of-type(1) {
        color: #ff6347; /* Orange */
    }
    .nav__item:nth-of-type(2) {
        color: #4caf50; /* Green */
    }
    .nav__item:nth-of-type(3) {
        color: #2196f3; /* Blue */
    }
    .nav__item:nth-of-type(4) {
        color: #ffeb3b; /* Yellow */
    }
    .nav__item:nth-of-type(5) {
        color: #9c27b0; /* Purple */
    }

    .nav__item--border-bottom{
            display: none; 
        }


    .nav__item:hover{
        text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 8px;
        transform: scale(1.1);
    }

    @media (min-width: 769px) {
        .nav__item--active {
            text-decoration: underline;
            text-decoration-thickness: 3px;
            text-underline-offset: 8px;
        }
    }

    // note the max-width. Applies on 768px below
    @media (max-width: 768px){

        flex-flow:column nowrap; 
        background-color: rgb(36, 35, 35); 
        position: fixed; 
        
        top: ${({ open }) => open ? '60px' : '-100vh'};
        // 60 pixels set which is same height of nav. Height of nav depends on logo.
        right: 0; 
        height: 100vh; 
        width: 70%; 
        transition: top 0.7s ease-in-out, transform 1s ease-in-out;
        font-family: "Open Sans";
        font-weight: 800;
        font-size: 22px;
        gap: 0; 
        transform: ${({open}) => open ? 'translateY(0)': 'translateY(-100%)'};

        .nav__item{
            text-decoration: none;
            padding: 2rem 0 2rem 2rem; 
        }

        .nav__item--border-bottom{
            display: block; 
            color: #fff;
            border-color: white;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            // This is since I don't want the hover effect to affect this border-bottom
        }

        
    }
    
`;

    

const RightNav = ({open, closeMenu}) => {
    const location = useLocation();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = ''; // Re-enable scrolling
        }
        return () => {
            document.body.style.overflow = ''; // Cleanup on unmount
        };
    }, [open]);

    return (
        <Ul open={open}>

            <Link to="/" className={`nav__item ${location.pathname === "/" ? "nav__item--active" : ""}`} onClick={closeMenu}>Home</Link>
            <div className="nav__item--border-bottom"></div>
            <Link to="/projects-list" className={`nav__item ${location.pathname === "/projects-list" ? "nav__item--active" : ""}`} onClick={closeMenu}>Vote</Link>
            <div className="nav__item--border-bottom"></div>
            <Link to="/navigation-assistant" className={`nav__item ${location.pathname === "/navigation-assistant" ? "nav__item--active" : ""}`} onClick={closeMenu}>Directions</Link>
            <div className="nav__item--border-bottom"></div>
            <Link to="/admin-login" className={`nav__item ${location.pathname === "/admin-login" ? "nav__item--active" : ""}`} onClick={closeMenu}>Admin</Link>
            <div className="nav__item--border-bottom"></div>
        </Ul>
    )
}

{/* <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Sign In</li>
            <li>Sign Up</li>
            Potential list ideas */}

export default RightNav