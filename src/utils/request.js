import axios from 'axios'

// axios封装
const service = axios.create({
  baseURL: '/api',
  timeout: 30 * 1000
})

export default service
