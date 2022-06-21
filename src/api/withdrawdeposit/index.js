import request from '@/utils/request'

// 提现余额
export function getBalance(params) {
  return request({
    url: `https://internal.dev.op-api-gateway.wonder-link.net/gotone-payment-api/mp/withdrawl/balance/query`,
    method: 'get',
    params
  })
}
// 提现订单列表
export function getList(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-payment-api/mp/withdrawl/list',
    method: 'post',
    params,
  })
}
// 提现账户列表
export function getmerList(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/select_by_merchant_id',
    method: 'get',
    params,
  })
}
// 添加提现账户
export function createUser(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/create',
    method: 'post',
    data: params,
  })
}
// 删除提现账户
export function deleteUser(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/delete_by_id',
    method: 'get',
    params,
  })
}
// 提现账户详情
export function detailUser(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/get_by_id',
    method: 'get',
    params,
  })
}
// 再次提交
export function submit_again(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/submit_again',
    method: 'get',
    params,
  })
}
// 获取银行信息
export function query_bank_info(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/eb/merchant/supplier/query_bank_info',
    method: 'get',
    params,
  })
}
// 是否可以继续添加
export function allow_or_not(params) {
  return request({
    url: 'https://internal.dev.op-api-gateway.wonder-link.net/gotone-settlement-api/op/supplier_apply/allow_or_not',
    method: 'get',
    params,
  })
}
