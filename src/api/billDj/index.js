import request from '@/utils/request'

//订单列表
export function billList(params) {
  return request({
    url: '/oilStationDailyBill/oilStationDailyBillList',
    method: 'post',
    data: params,
  })
}


//关联订单
export function commitOrder(params) {
  return request({
    url: `/oilStationDailyBill/billDetailList`,
    method: 'post',
    data: params,
  })
}