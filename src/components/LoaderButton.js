import React from "react";
import "./LoaderButton.css";
import { Button, Glyphicon } from "react-bootstrap";

export default function LoaderButton({
	isLoading,
	className = "",
	disabled = false,
	...props
}) {
	return (
		<Button
			className={`loaderButton ${className}`}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && <Glyphicon glyph="refresh" className="spinning" />}
			{props.children}
		</Button>
	);
}
