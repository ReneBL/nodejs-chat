import React from 'react';
import './FormButton.css';

function FormButton({ message, ...restProps }) {
    return <button className="FormButton" {...restProps}>{message}</button>;
}

export default FormButton;