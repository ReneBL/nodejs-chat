import React from 'react';
import './FormField.css';

function FormField(props) {

    return (
        <div className="Formfield">
            <input className="Formfield-input" type={props.type} placeholder={props.placeholder}
                id={props.id} value={props.value} onChange={props.onChange} />
        </div>
    );

}

export default FormField;