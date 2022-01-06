import React from 'react';
import { renderRoutes } from "react-router-config";
import { Layout } from 'antd';
import Breadcrumbs from '@bccomponent/Breadcrumb';

const { Content } = Layout;

class PageLayout extends React.Component {
	render () {
		return (
		<Content>
			<Breadcrumbs routers={this.props.route} />
			<div className="basic-layout-content">
				{renderRoutes(this.props.route.routes, { someProp: "these extra props are optional" })}
			</div>
		</Content>
		)
	}
}

export default PageLayout;
