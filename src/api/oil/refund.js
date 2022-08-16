import request from '@/utils/orderRequest';
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