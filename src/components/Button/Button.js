import React from 'react'
import './Button.css'
import { useNavigate } from 'react-router-dom';

const Button = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.buttonNavigateTo) {
      navigate(props.buttonNavigateTo); 
    }
  };

  return (

    <button className={`btn btn--${props.buttonType} btn--${props.buttonSize} card--${props.buttonCardNo} btn--${props.buttonWidth} ${props.className}`} onClick={handleClick}>{props.buttonText}</button>
        
  )
}

export default Button