import { message } from 'ant-design-vue'
import axios from 'axios'
const request = axios.create({
   // baseURL: process.env.VUE_APP_BASE_API,
   timeout: 5000,
})
let codeInfo = ['正常', '数据库访问错误', '访问实时数据库错误', '传参错误']
//请求拦截器
request.interceptors.request.use()
//响应拦截器
request.interceptors.response.use(
   response => {
      let code = response.data.code
      if (!code) {
         return response.data
      } else if (codeInfo[code]) {
         return message.warning(codeInfo[code])
      }
   },
   error => {
      return message.error(error)
   }
)

export default request
