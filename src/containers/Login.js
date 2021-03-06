import React, { useState } from "react";
import "./Login.css";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";

export default function Login() {
	const history = useHistory();
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);
	const [fields, handleFieldChange] = useFormFields({
		email: "",
		password: "",
	});

	function validateForm() {
		return fields.email.length > 0 && fields.password.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.signIn(fields.email, fields.password);
			userHasAuthenticated(true);
			history.push("/");
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	return (
		<div className="login">
			<form onSubmit={handleSubmit}>
				<FormGroup controlId="email" bsSize="large">
					<ControlLabel>Email</ControlLabel>
					<FormControl
						autoFocus
						type="email"
						value={fields.email}
						onChange={handleFieldChange}
					/>
				</FormGroup>
				<FormGroup controlId="password" bsSize="large">
					<ControlLabel>Password</ControlLabel>
					<FormControl
						type="password"
						value={fields.password}
						onChange={handleFieldChange}
					/>
				</FormGroup>
				<LoaderButton
					block
					bsSize="large"
					disabled={!validateForm()}
					type="submit"
					isLoading={isLoading}
				>
					Login
				</LoaderButton>
			</form>
		</div>
	);
}
