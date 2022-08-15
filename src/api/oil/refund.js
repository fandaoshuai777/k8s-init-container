import request from '@/utils/orderRequest';
const url = 'http://192.168.3.87:8888/'
//退款list
export function list(data) {
  return request({
    url: `${url}/audit/order/list`,
    method: 'post',
    data
  })
}
//通过退款
export function refundOrder(data) {
  return request({
    url: `${url}/audit/order/refundOrder`,
    method: 'post',
    data

  })
}
//拒绝退款
export function rejectedRefundOrder(data) {
  return request({
    url: `${url}/audit/order/rejectedRefundOrder`,
    method: 'post',
    data
  })
} 