import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import openSocket from "socket.io-client";

import './style.scss';

const LoginScanCode = (props) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(props.url)
    }, [props.url])

	return (
    <div className="login-scan">
        <div className="code">
          <img src={url} alt="" />
        </div>
        <span className="tips">打开<i className="tips_warning">今球App</i>扫描二维码登录</span>
      </div>
	)
}

export default LoginScanCode;
