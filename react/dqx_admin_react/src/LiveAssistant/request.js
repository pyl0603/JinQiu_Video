import axios from 'axios'
import { message } from 'antd';
import Cookies from "js-cookie";

const service = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.1.200:9000/client-live-assistant' : 'https://api.jinqiulive.com/client-live-assistant',
    // baseURL: 'https://api.jinqiulive.com/client-live-assistant',
    withCredentials: false,
    timeout: 15000
})


service.interceptors.request.use(
    config => {
        // if (config.url === 'https://duoquxiang.oss-cn-shenzhen.aliyuncs.com') {
        //     config.url = config.url
        // } else {
        //     config.url = `http://192.168.1.200:${Cookies.get('Category')}/client-ad` + config.url
        // }
        if(Cookies.get('token')){
            config.headers['Authorization'] = 'Bearer' + ' ' + (Cookies.get('token') == null ? '': Cookies.get('token'))
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        if (response.data.code === 401) {
            Cookies.remove('token')
            // eslint-disable-next-line no-undef
            window.location.href = '/liveassistant.html#/Login'
        }
        const res = response.data
        if (response.data.code !== 0) {
            message.error(res.message || 'error');
            return Promise.reject(res.message || 'error');
            // eslint-disable-next-line no-else-return
        } else {
            return res;
        }
    },
    error => {
        message.error(error.message);
        return Promise.reject(error)
    }
)

export default service