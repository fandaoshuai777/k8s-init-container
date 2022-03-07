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
//订单下拉
export function billStatusDict(params) {
  return request({
    url: 'api/stationSettle/billStatusDict',
    method: 'post',
    data: params,
  })
}
//交易类型下拉
export function payTypeDict(params) {
  return request({
    url: 'api/stationSettle/payTypeDict',
    method: 'post',
    data: params,
  })
}
//油站下拉
export function oilStationDict() {
  return request({
    url: `api/order/oilStationDict`,
    method: 'post',
  })
}