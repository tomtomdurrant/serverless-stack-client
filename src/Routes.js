import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			{/* Finally, catch all unmatched routes */}
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}
