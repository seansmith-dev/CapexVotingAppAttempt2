import React from 'react'
import './Button.css'

const Button = (props) => {
  return (

        <div className={`btn btn--${props.buttonType} button--${props.size}`}>
            <h2 className={`btn__${props.buttonType}--text`}>Vote</h2>
        </div>

  )
}

export default Button
