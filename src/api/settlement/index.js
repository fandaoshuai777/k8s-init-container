import request from '@/utils/requstGatway'

//账单
export function get_settle(params) {
  return request({
    url: '/gotone-settlement-api/mp/merchant/bill/get_settle_by_station_id_and_date',
    method: 'GET',
    params,
  })
}