import React from 'react';
import FormField from '../formfield/FormField';
import FormButton from '../formbutton/FormButton';

function RegisterForm(props) {

	return (
		<form>
			<FormField id="nameField" type="text" label="Name"
				placeholder="Enter a name..." onChange={props.handleNameChange} />
			<FormField id="surnameField" type="text" label="Surname"
				placeholder="Enter a surname..." onChange={props.handleSurnameChange} />
			<FormField id="nicknameField" type="text" label="Nickname"
				placeholder="Enter a valid nickname..." onChange={props.handleNicknameChange} />
			<FormField id="passField" type="password" label="Password"
				placeholder="Enter a password..." onChange={props.handlePassChange} />
			<FormButton type="submit" onClick={props.onSubmitClicked} message="Register" />
		</form>
	);

}

export default RegisterForm;