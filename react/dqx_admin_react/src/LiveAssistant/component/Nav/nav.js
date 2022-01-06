import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu } from 'antd';

import { menus } from '../../router';
import BreadcrumbNameMap from '../../layouts/menu';

const { SubMenu } = Menu;
const NavsNameMap = BreadcrumbNameMap;

/**
 * 
 * @param {string} name  路径
 * @param {Array} routes 子路由
 */
function submenu(name, routes) {
	return (
		routes.hidden
		?
		null
		:
		<SubMenu key={name} title={NavsNameMap[name]}>
			{
			routes.map(item => {
				return (
					item.hidden
					?
					null
					:
					item.routes ? submenu(item.path, item.routes)
					:
					<Menu.Item key={item.path}>
						<NavLink to={item.path}>{NavsNameMap[item.path]}</NavLink>
					</Menu.Item>
				)
			})
			}
		</SubMenu>
	)
}

const Navs = withRouter((props) => {
	const { location } = props;
	const current = location.pathname;
	const currentArr = current.split('/').filter(i => i);
	const pathSnippets = currentArr.map((_, index) => {
		const url = `/${currentArr.slice(0, index + 1).join('/')}`;
    return url;
	})
	let routesArr = menus[0].routes
  const extraMenuItems = routesArr.map((url, index) => {
    return (
			url.hidden
			?
			null
			:
			url.routes && url.routes.length > 0 ?
			submenu(url.path, url.routes)
			:
			<Menu.Item key={url.path}>
				<NavLink activeClassName="active" to={url.path}>{NavsNameMap[url.path]}</NavLink>
			</Menu.Item>
		);
	});
	const menucrumbItems = [].concat(extraMenuItems);
  return (
		<Menu mode="inline" theme="dark" selectedKeys={pathSnippets}>
      {menucrumbItems}
		</Menu>
  );
});

export default Navs;
