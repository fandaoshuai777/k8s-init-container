import request from '@/utils/requstGatway';

//闪付订单列表
export function quickPassOrderList(data) {
  return request({
    url: `/gotone-order-api/order/quickPassOrderList`,
    method: 'post',
    data
  })
}
//闪付订单详情
export function oneClickOrderDetails(params) {
  return request({
    url: `/gotone-order-api/order/oneClickOrderDetails`,
    method: 'GET',
    params
  })
}
//闪付订单统计
export function quickPassOrderCount(data) {
  return request({
    url: `/gotone-order-api/order/quickPassOrderCount`,
    method: 'POST',
    data
  })
}

//导出
export function exportPassOrder(params) {
  return request({
    url: `/gotone-order-api/export/exportPassOrder`,
    method: 'post',
    data:params
  })
}