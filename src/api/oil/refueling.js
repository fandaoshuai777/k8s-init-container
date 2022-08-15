import request from '@/utils/orderRequest';
const url = 'http://192.168.3.87:8888'
//订单列表
export function oneClickOrderList(data) {
  return request({
    url: `/gotone-order-api/order/oneClickOrderList`,
    method: 'post',
    data
  })
}
//订单详情
export function oneClickOrderDetails(params) {
  return request({
    url: `/gotone-order-api/order/oneClickOrderDetails`,
    method: 'GET',
    params
  })
}
//订单统计
export function oneClickOrderCount(data) {
  return request({
    url: `/gotone-order-api/order/oneClickOrderCount`,
    method: 'POST',
    data
  })
}
//补打小票
export function printReceipt(thirdOrderId) {
  return request({
    url: `/gotone-merchant-api/order/printReceipt/${thirdOrderId}`,
    method: 'GET',
  })
}
//申请退款
export function refundReview(params) {
  return request({
    url: `${url}/order/orderInfo/refundReview`,
    method: 'post',
    data: params,
  })
}