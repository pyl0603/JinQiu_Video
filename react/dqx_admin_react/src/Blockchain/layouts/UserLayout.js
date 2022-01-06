import React from 'react';
import {
	Switch
	} from "react-router-dom";
import { renderRoutes } from "react-router-config";

class UserLayout extends React.Component {
	render () {
		return (
		<div className="user-layout-content">
			<Switch>
				{renderRoutes(this.props.route.routes, { someProp: "these extra props are optional" })}
			</Switch>
		</div>
		)
	}
}

export default UserLayout;
