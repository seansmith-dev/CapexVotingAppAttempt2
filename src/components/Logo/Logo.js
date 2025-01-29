import React from "react"; 
import { Link } from "react-router-dom"; // Import Link
import './Logo.css';
import logo from '../../assets/logo.png';

function Logo({ size }) {
    return (
        <Link to="/"> {/* Navigate to home on click */}
            <img src={logo} alt="logo" className="logo"/>
        </Link>
    );
}

export default Logo;
