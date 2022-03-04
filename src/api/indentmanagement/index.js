import request from '@/utils/request'

//订单列表
export function orderPage(params) {
  return request({
    url: 'api/order/orderPage',
    method: 'post',
    data: params,
  })
}
//订单详情
export function orderInfo(params) {
  return request({
    url: `api/order/orderInfo/${params}`,
    method: 'post',
  })
}
//补打小票
export function stamp(params) {
  return request({
    url: `api/order/orderInfo/stamp/${params}`,
    method: 'post',
  })
}
//申请退款
export function refundReview(params) {
  return request({
    url: `api/order/orderInfo/refundReview/${params}`,
    method: 'post',
  })
}
