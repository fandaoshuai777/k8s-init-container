import request from '@/utils/request'

// 提现余额
export function getBalance(params) {
  console.log(params)
  return request({
    url: `https://internal.dev.op-api-gateway.wonder-link.net/gotone-payment-api/mp/withdrawl/balance/query?stationId=${params.stationId}`,
    method: 'get',
  })
}
// 提现订单列表
export function getList(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-payment-api/mp/withdrawl/list',
    method: 'post',
    data: params,
  })
}
// 提现账户列表
export function getmerList(params) {
  return request({
    url: '/gotone-settlement-api/settlement/supplier_apply/select_by_merchant_id',
    method: 'post',
    data: params,
  })
}
// 添加提现账户
export function createUser(params) {
  return request({
    url: '/gotone-settlement-api/settlement/supplier_apply/create',
    method: 'post',
    data: params,
  })
}
// 删除提现账户
export function deleteUser(params) {
  return request({
    url: '/gotone-settlement-api/settlement/supplier_apply/delete_by_id',
    method: 'post',
    data: params,
  })
}
// 提现账户详情
export function detailUser(params) {
  return request({
    url: '/gotone-settlement-api/settlement/supplier_apply/get_by_id',
    method: 'post',
    data: params,
  })
}