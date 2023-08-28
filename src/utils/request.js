import { message } from 'ant-design-vue'
import axios from 'axios'

const request = axios.create({
   baseURL: process.env.VUE_APP_BASE_API,
   timeout: 10000,
})
// let codeInfo = ['正常', '数据库访问错误', '访问实时数据库错误', '传参错误']
//请求拦截器
request.interceptors.request.use()
//响应拦截器
request.interceptors.response.use(
   response => {
      let code = response.data.code

      if (!code) {
         return response.data
      } else if (code) {
         message.error(response.data.msg)
         return Promise.reject(new Error(response.data.msg))
      } else {
         return response.data
      }
   },
   error => {
      if (error.response.status === 500) return message.error('未查询到数据')
      message.error(error.message)
      return Promise.reject(error)
   }
)

export default request
