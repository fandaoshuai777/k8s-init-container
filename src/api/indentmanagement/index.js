import request from '@/utils/request'

export function orderPage(params) {
  return request({
    url: 'api/order/orderPage',
    method: 'post',
    data: params,
    header: {
      token: 'merchant-server-token'
    }
  })
}

