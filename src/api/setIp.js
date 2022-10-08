import request from '../utils/request'
export const setIp = (ip) => {
  return request({
    url: `/setIp/${ip}`,
    method: 'GET'
  })
}
