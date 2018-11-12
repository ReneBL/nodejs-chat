import React from 'react';
import FormField from '../formfield/FormField';
import './LoginForm.css';
import FormButton from '../formbutton/FormButton';

function LoginForm(props) {

    return (
        <div className="Loginform">
            <form>
                <FormField id="nicknameField" type="text"
                    placeholder="Nickname" onChange={props.handleNicknameChange} />
                <FormField id="passField" type="password" label="Password"
                    placeholder="Password" onChange={props.handlePassChange} />
                <FormButton type="submit" onClick={props.onSubmitClicked} message="Login" />
            </form>
        </div>
    );

}

export default LoginForm;