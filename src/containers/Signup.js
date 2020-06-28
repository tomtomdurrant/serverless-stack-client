import { useFormFields } from "../libs/hooksLib";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import {
	FormGroup,
	ControlLabel,
	FormControl,
	HelpBlock,
} from "react-bootstrap";
import React, { useState } from "react";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth } from "aws-amplify";
import { onError } from "../libs/errorLib";

export default function Signup() {
	const [fields, handleFieldChange] = useFormFields({
		email: "",
		password: "",
		confirmPassword: "",
		confirmationCode: "",
	});
	const history = useHistory();
	const [newUser, setNewUser] = useState(null);
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);

	function validateForm() {
		return (
			fields.email.length > 0 &&
			fields.password.length > 0 &&
			fields.password === fields.confirmPassword
		);
	}

	function validateConfirmationCode() {
		return fields.confirmationCode.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);
		try {
			const newSignup = await Auth.signUp({
				username: fields.email,
				password: fields.password,
			});
			setIsLoading(false);
			setNewUser(newSignup);
		} catch (error) {
			onError(error);
			setIsLoading(false);
		}
	}

	async function handleConfirmationSubmit(event) {
		event.preventDefault();

		setIsLoading(true);
		try {
			await Auth.confirmSignUp(fields.email, fields.confirmationCode);
			await Auth.signIn(fields.email, fields.password);
			userHasAuthenticated(true);
			history.push("/");
		} catch (error) {
			onError(error);
			setIsLoading(false);
		}
	}

	function renderConfirmationForm() {
		return (
			<form onSubmit={handleConfirmationSubmit}>
				<FormGroup controlId="confirmationCode" bsSize="large">
					<ControlLabel>Confirmation Code</ControlLabel>
					<FormControl
						autoFocus
						type="tel"
						onChange={handleFieldChange}
						value={fields.confirmationCode}
					/>
					<HelpBlock>Please check your email for the code.</HelpBlock>
				</FormGroup>
				<LoaderButton
					block
					type="submit"
					bsSize="large"
					isLoading={isLoading}
					disabled={!validateConfirmationCode}
				>
					Verify
				</LoaderButton>
			</form>
		);
	}

	function renderSignupForm() {
		return (
			<form onSubmit={handleSubmit}>
				<FormGroup controlId="email" bsSize="large">
					<ControlLabel>Email</ControlLabel>
					<FormControl
						autoFocus
						type="email"
						onChange={handleFieldChange}
						value={fields.email}
					/>
				</FormGroup>
				<FormGroup controlId="password" bsSize="large">
					<ControlLabel>Password</ControlLabel>
					<FormControl
						type="password"
						onChange={handleFieldChange}
						value={fields.password}
					/>
				</FormGroup>
				<FormGroup controlId="confirmPassword" bsSize="large">
					<ControlLabel>Confirm Password</ControlLabel>
					<FormControl
						type="password"
						onChange={handleFieldChange}
						value={fields.confirmPassword}
					/>
				</FormGroup>
				<LoaderButton
					block
					type="submit"
					bsSize="large"
					isLoading={isLoading}
					disabled={!validateForm}
				>
					Signup
				</LoaderButton>
			</form>
		);
	}

	return (
		<div className="signup">
			{newUser === null ? renderSignupForm() : renderConfirmationForm()}
		</div>
	);
}
