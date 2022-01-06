import React from 'react';
import { Spin } from 'antd';

import './style.scss';

class Loading extends React.Component {
    constructor(props) {
				super(props) 
				console.log(props)
    }
    render() {
			return (
        <Spin className="loading" size="large" spinning={this.props.isLoading} />
    )
	}
}

export default Loading;

Loading.defaultProps={
    isLoading: false
}
  
