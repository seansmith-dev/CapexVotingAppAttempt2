import React from 'react'
import './Button.css'
import HowToVoteIcon from '@mui/icons-material/HowToVote';

const Button = (props) => {
  return (

        <div className={`btn btn--${props.buttonType} button--${props.size}`}>
            <h2 className={`btn__${props.buttonType}--text`}>Vote</h2>
            <HowToVoteIcon className="btn-icon" fontSize="medium"  />
        </div>

  )
}

export default Button
