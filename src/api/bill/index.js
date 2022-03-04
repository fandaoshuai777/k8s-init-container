import request from '@/utils/request'

//订单列表
export function billList(params) {
  return request({
    url: 'api/stationSettle/stationDailyBillList',
    method: 'post',
    data: params,
  })
}
//订单明细
export function billDetailList(params) {
  return request({
    url: 'api/stationSettle/billDetailList',
    method: 'post',
    data: params,
  })
}
