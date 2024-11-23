import React from "react"; 
import './Logo.css'

function Logo({ size }){
    return(

            <div className={`logo logo--${size}`}></div>
            
       
    )
}

export default Logo;