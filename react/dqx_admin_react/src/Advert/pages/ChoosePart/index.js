import React from 'react';
import Cookies from 'js-cookie';

import './style.scss';

class ChoosePart extends React.Component {
	getIn(type, val) {
		Cookies.set('Category', val);
		localStorage.setItem('type', type);
		this.props.history.push('/user/login');
	}
    render () {
      return (
				<div className="choose">
					<div className="for-center">
						<div className="complete cp antd-cp" onClick={() => this.getIn('complete', 9000)}>
							<span>今球模块</span>
						</div>
						<div className="simplify cp antd-cp" onClick={() => this.getIn('simplify', 19000)}>
							<span>简化模块</span>
						</div>
					</div>
				</div>
			)
    }
}

export default ChoosePart;
