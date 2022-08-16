import request from '@/utils/requstGatway';

//储值订单列表
export function storedOrderList(data) {
  return request({
    url: `/gotone-order-api/order/storedOrderList`,
    method: 'post',
    data
  })
}
//储值订单详情
export function oneClickOrderDetails(params) {
  return request({
    url: `/gotone-order-api/order/oneClickOrderDetails`,
    method: 'GET',
    params
  })
}
//储值订单统计
export function storedOrderCount(data) {
  return request({
    url: `/gotone-order-api/order/storedOrderCount`,
    method: 'POST',
    data
  })
}