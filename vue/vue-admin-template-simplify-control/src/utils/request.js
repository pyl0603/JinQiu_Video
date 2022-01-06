import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken, getCategory } from '@/utils/auth'

let loading

function startLoading() {
    return Loading.service({
        lock: true,
        text: '手动狗头',
        // background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading(loading) { //使用Element loading-close 方法
    loading.close()
}

// create an axios instance
const service = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? 'http://47.112.156.17:9000/client-admin' : 'https://api.jinqiulive.com/client-admin', // url = base url + request url
    // baseURL: process.env.VUE_APP_BASE_API,
    baseURL: 'http://192.168.1.200:19000/client-admin',
    withCredentials: false, // send cookies when cross-domain requests
    timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {

            startLoading();
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation


            // 切换类型
            config.headers['Category'] = getCategory();
            config.headers['Authorization'] = 'Bearer' + ' ' + getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        endLoading(startLoading())
            // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 0) {
            Message({
                message: res.message || 'error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(res.message || 'error')
        } else {
            return res
        }
    },
    error => {
        endLoading(startLoading())
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service