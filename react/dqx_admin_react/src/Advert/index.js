import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import store from "./redux/store";
import './index.css';
import App from './app';
import * as serviceWorker from '../serviceWorker';

ReactDOM.render(
  <Provider store={store}>
		<ConfigProvider locale={zhCN}>
			<App />
		</ConfigProvider>
	</Provider>,
document.getElementById('root'));
serviceWorker.unregister();
