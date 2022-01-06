import React from 'react';
import {
		Switch
  } from "react-router-dom";
import { renderRoutes } from "react-router-config";

class ContentLayout extends React.Component {
	render () {
		return (
      <Switch>
        {renderRoutes(this.props.route.routes, { someProp: "these extra props are optional" })}
      </Switch>
		)
	}
}

export default ContentLayout;
