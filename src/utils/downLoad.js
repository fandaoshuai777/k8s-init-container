import { Local } from '@/utils/storage';
import axios from 'axios'
function baseURLEnv() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://merchant-server-test.c29dd69ffd4404f389adfa283b540267b.cn-hangzhou.alicontainer.com'
  } else if (window.location.hostname.indexOf('ciecdev') !== -1) {
    return 'https://merchant-server.ciecdev.com'
  } else if (window.location.hostname.indexOf('test') !== -1) {
    return 'http://merchant-server-test.c29dd69ffd4404f389adfa283b540267b.cn-hangzhou.alicontainer.com'
  } else if (window.location.hostname.indexOf('fat-1') !== -1) {
    return ' http://internal.fat-1.merchant-server.wonderlink.cc'
  } else {
    return 'http://merchant-server.cngotone.com'
  }
}
export const downloadBlob = (fileName, url, info) => {
  const apiUrl = baseURLEnv() + url + info

  axios.get(apiUrl, { responseType: 'blob', headers: { 'merchant-server-token': Local.get('token') } }).then((res) => {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let num = ''
    for (let i = 0; i < 13; i++) {
      num += Math.ceil(Math.random() * 10)
    }

    if (res.data.type === 'image/jpeg') {
      link.setAttribute('download', fileName + num + '.JPG')
    } else {
      link.setAttribute('download', fileName + num + '.xls')
    }

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
