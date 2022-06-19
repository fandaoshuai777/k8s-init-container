import request from '@/utils/request'

//提现账户列表
export function getmerList(params) {
  return request({
    url: '/gotone-settlement-api/settlement/supplier_apply/select_by_merchant_id',
    method: 'post',
    data: params,
  })
}