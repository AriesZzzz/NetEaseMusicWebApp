import axios from 'axios'
import { Toast } from 'vant'

export default function request(url, data = {}, method = "GET") {
    return new Promise((resolve, reject) => {
        let promise
        if (method === "GET") {
            promise = axios.get(url, { params: data, withCredentials: true }) // params配置指定查询字符串
        } else {
            promise = axios.post(url, data)
        }
        // 统一捕获错误，避免大量try catch 在外部函数
        promise.then(res => {
            resolve(res)
        }).catch(err => {
            Toast('请求出错'+ err.message)
        })
    })
}

