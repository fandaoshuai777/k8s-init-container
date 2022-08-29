import request from '@/utils/requstGatway';

//下载中心列表
export function selectPage(data) {
    return request({
        url: `/gotone-cms-api/mp/async/export/select_page`,
        method: 'post',
        data
    })
}
//删除
export function deleteById(data) {
    return request({
        url: `/gotone-cms-api/mp/async/export/delete_by_id`,
        method: 'post',
        data
    })
}
//下载
export function download(id) {
    return request({
        url: `/gotone-cms-api/mp/async/export/download?id=${id}`,
        method: 'GET',
        responseType:'blob'
    })
}
