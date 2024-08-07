import axios from 'axios'
import { Modal, message } from 'antd'

const domain = 'https://yyh.world/api/reactMs/mock/'

const getUrl = (url) => {
    // 请求时 传入URL 开头可加斜线也可不加 均不会报错
    url = /^\//.test(url) ? url.substr(1) : url
    return url.includes('http') ? url : domain + url
}

const showLoading = () => {
    const loading = document.querySelector('.my-loading')
    loading.style.display = 'block'
}

const closeLoading = () => {
    const loading = document.querySelector('.my-loading')
    loading.style.display = 'none'
}

axios.interceptors.response.use(resp => {
    closeLoading()
    let res = resp.data
    if (resp.status === 200) {  // HTTP 状态码
        if (res.status === '1' || res.code === 200) { // 前后端约定状态码
            if (resp.config.method === 'post') {
                message[res.result ? 'success' : 'error'](res.result ? '操作成功' : '操作失败')
            }
            return res
        }
        Modal.info({
            title: '提示',
            content: res.msg || res.desc || '网络出错，请稍后再试'
        })

    }
    else {
        Modal.info({
            title: '提示',
            content: resp.desc || '网络出错，请稍后再试'
        })
        return Promise.reject(resp.result)
    }
})

const checkUrl = (url) => {
    if (!url) {
        console.error('没有传入 URL，请检查调用情况！')
        return false
    }
    return true
}

export default class Axios {
    static get (url, params, loading = true) {
        loading && showLoading()
        return checkUrl(url) && axios.get(getUrl(url), { params })
    }
    static post (url, data) {
        checkUrl(url)
        return checkUrl(url) && axios.post(getUrl(url), data)
    }
}