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
    list-style: none; 
    z-index: 1000;

    .nav__item {
        font-weight: 900;
        font-size: 1.5rem;
        transform: scale(1);
        transition: transform 250ms;
        letter-spacing: 1px;  
        text-decoration: none; 
    }

    /* Define different colors for each item */
    .nav__item:nth-of-type(1) { color: #ff6347; }
    .nav__item:nth-of-type(2) { color: #4caf50; }
    .nav__item:nth-of-type(3) { color: #2196f3; }
    .nav__item:nth-of-type(4) { color: #ffeb3b; }

    /* Hover effect */
    .nav__item:hover {
        transform: scale(1.1);
    }

    /* Active (current page) underline - ONLY on larger screens */
    @media (min-width: 769px) {
        .nav__item--active {
            text-decoration: underline;
            text-decoration-thickness: 3px;
            text-underline-offset: 8px;
        }
    }

    /* Mobile styles */
    @media (max-width: 768px) {
        flex-flow: column nowrap; 
        background-color: rgb(36, 35, 35); 
        position: fixed; 
        top: ${({ open }) => open ? '60px' : '-100vh'};
        right: 0; 
        height: 100vh; 
        width: 70%; 
        transition: top 0.7s ease-in-out, transform 1s ease-in-out;
        font-family: "Open Sans";
        font-weight: 800;
        font-size: 22px;
        gap: 0; 
        transform: ${({ open }) => open ? 'translateY(0)' : 'translateY(-100%)'};

        .nav__item {
            padding: 2rem 0 2rem 2rem; 
        }

        /* Mobile does NOT have an underline */
        .nav__item--active {
            text-decoration: none;
        }
    }
`;

const RightNav = ({ open }) => {
    const location = useLocation(); 

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = ''; 
        }
        return () => {
            document.body.style.overflow = ''; 
        };
    }, [open]);

    return (
        <Ul open={open}>
            <Link to="/" className={`nav__item ${location.pathname === "/" ? "nav__item--active" : ""}`}>Home</Link>
            <Link to="/projects-list" className={`nav__item ${location.pathname === "/projects-list" ? "nav__item--active" : ""}`}>Vote</Link>
            <Link to="/navigation-assistant" className={`nav__item ${location.pathname === "/navigation-assistant" ? "nav__item--active" : ""}`}>Directions</Link>
            <Link to="/admin-login" className={`nav__item ${location.pathname === "/admin-login" ? "nav__item--active" : ""}`}>Admin</Link>
        </Ul>
    );
};

export default RightNav;
