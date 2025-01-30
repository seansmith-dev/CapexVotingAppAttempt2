import React from 'react';
import './Button-with-icon.css';
import { useNavigate } from 'react-router-dom';

const ButtonWithIcon = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.buttonNavigateTo) {
      navigate(props.buttonNavigateTo); 
    }
  };

  return (
        <div className={`btn-with-icon btn-with-icon--${props.buttonType} btn-with-icon--${props.size} btn-with-icon--${props.width} ${props.className}`} onClick={handleClick}>
            <p className={`btn-with-icon__text btn-with-icon--${props.size}`}>{props.text}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="svg">
              <path d="M20.5 15.5H3.5v5H20.5v-5Zm1.45-1.03.02.06.02.1.01.1V21.25c0 .38-.28.69-.65.74H2.75c-.38.01-.69-.28-.74-.64V14.75l-.01-.05.01-.09c.01-.05.03-.11.05-.15L4.82 8.44c.11-.23.32-.39.57-.43l2.65-.01-.86 1.5L5.98 9.5 3.92 14H20.07l-2.03-4.35.86-1.5c.07.05.12.11.17.18l.05.09 2.81 6.04ZM13.37 2.06l5.28 3.05c.33.19.46.59.32.93L16.11 11l1.14 0c.41 0 .75.34.75.75 0 .38-.28.69-.65.74H6.75c-.41.01-.75-.33-.75-.74 0-.38.28-.69.65-.74L8.57 11l-.18-.1c-.33-.19-.46-.59-.32-.93l.04-.09 4.32-7.5c.19-.33.59-.46.93-.32Zm-.01 1.72L9.79 9.97 11.57 11h2.82l2.87-4.97-3.89-2.25Z"/>
            </svg>
        </div>
  )
}

export default ButtonWithIcon
