import request from '@/utils/orderRequest';
let url = ' http://internal.fat1.merchant-server.wonderlink.cc'
if (process.env.NODE_ENV === 'development') {
  url = 'https://internal.fat1.op-api-gateway.wonderlink.cc'
} else if (window.location.hostname.indexOf('fat1') !== -1) {
  url = 'https://internal.fat1.op-api-gateway.wonderlink.cc'
} else {
  url = 'https://op-api-gateway.wonder-link.net'
}
//退款list
export function list(data) {
  return request({
    url: `/audit/order/list`,
    method: 'post',
    data
  })
}
//通过退款
export function refundOrder(data) {
  return request({
    url: `/audit/order/refundOrder`,
    method: 'post',
    data

  })
}
//拒绝退款
export function rejectedRefundOrder(data) {
  return request({
    url: `/audit/order/rejectedRefundOrder`,
    method: 'post',
    data
  })
} 
//导出
export function exportRefundOrder(data) {
  return request({
    url: `${url}/gotone-order-api/export/exportRefundOrder`,
    method: 'post',
    data
  })
} 