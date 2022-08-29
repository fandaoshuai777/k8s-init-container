import { Local } from '@/utils/storage';
import axios from 'axios'
function baseURLEnv() {
  if (process.env.NODE_ENV === 'development') {
    // return 'https://internal.dev.op-api-gateway.wonder-link.net'
    return ' https://internal.fat-1.op-api-gateway.wonderlink.cc'

  } else if (window.location.hostname.indexOf('fat-1') !== -1) {
    return ' https://internal.fat-1.op-api-gateway.wonderlink.cc'
  } else {
    return 'http://merchant-server.cngotone.com'
  }
}
export const downloadBlob = (fileName, url, info) => {
  const apiUrl = baseURLEnv() + url + info

  axios.get(apiUrl, { responseType: 'blob', headers: { 'merchant-server-token': Local.get('token')} }).then((res) => {
    console.log(res)
    const link = document.createElement('a')
    const blob = new Blob([res.data])
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName + '.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
