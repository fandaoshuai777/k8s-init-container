import request from '@/utils/request'

//结算日账单
export function billList(params) {
  return request({
    url: '/stationSettle/stationDailyBillList',
    method: 'GET',
    data: params,
  })
}