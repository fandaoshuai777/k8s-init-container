import request from '@/utils/requstGatway';


// 提现余额
export function getBalance(params) {
  return request({
    url: `/gotone-payment-api/mp/balance/query`,
    method: 'get',
    params
  })
}
// 提现申请
export function withdrawl(params) {
  return request({
    url: `/gotone-payment-api/mp/withdrawl`,
    method: 'post',
    data: params,
  })
}
// 提现订单列表
export function getList(params) {
  return request({
    url: `/gotone-payment-api/mp/withdrawl/list`,
    method: 'post',
    data: params,
  })
}
// 提现账户列表
export function getmerList(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/select_by_merchant_id`,
    method: 'get',
    params,
  })
}
// 添加提现账户
export function createUser(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/create`,
    method: 'post',
    data: params,
  })
}
// 删除提现账户
export function deleteUser(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/delete_by_id`,
    method: 'get',
    params,
  })
}
// 提现账户详情
export function detailUser(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/get_by_id`,
    method: 'get',
    params,
  })
}
// 再次提交
export function submit_again(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/submit_again`,
    method: 'get',
    params,
  })
}
// 获取银行信息
export function query_bank_info(params) {
  return request({
    url: `/gotone-settlement-api/mp/merchant/supplier/query_bank_info`,
    method: 'get',
    params,
  })
}
// 是否可以继续添加
export function allow_or_not(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/allow_or_not`,
    method: 'get',
    params,
  })
}
// 上传图片
export function uploadPhoto(data) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/upload`,
    method: 'post',
    data,
  })
}
// 可提现账户
export function select_by_merchant_id(params) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/select_withdrawal_account_by_merchant_id`,
    method: 'get',
    params,
  })
}
// 删除提现卡
export function delete_by_merchant_id(id) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/del/card/${id}`,
    method: 'get',
  })
}
// 修改提现卡
export function editCard(data) {
  return request({
    url: `/gotone-settlement-api/mp/supplier_apply/edit/card`,
    method: 'post',
    data
  })
}