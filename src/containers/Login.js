import React, { useState } from "react";
import "./Login.css";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";

export default function Login() {
	const { userHasAuthenticated } = useAppContext();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);

	function validateForm() {
		return email.length > 0 && password.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.signIn(email, password);
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
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</FormGroup>
				<FormGroup controlId="password" bsSize="large">
					<ControlLabel>Password</ControlLabel>
					<FormControl
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
