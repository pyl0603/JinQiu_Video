import React from 'react';
import { Layout } from 'antd';

import Navs from './nav';

import Cookies from "js-cookie";

import './style.scss';

const { Sider } = Layout;

class Nav extends React.Component {

  render () {
    return (
      !this.props.collapsed ?
      <Sider collapsed = { this.props.collapsed }>
        <div className="logo">
          <h1 className="title">专家发布系统</h1>
        </div>
				<Navs />
      </Sider>
      :
      null
    )
  }
}

export default Nav;
