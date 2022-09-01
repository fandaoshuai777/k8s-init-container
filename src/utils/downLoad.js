import { Local } from '@/utils/storage';
import axios from 'axios'
function baseURLEnv() {
  if (process.env.NODE_ENV === 'development') {
    // return 'https://internal.dev.op-api-gateway.wonder-link.net'
    return 'http://192.168.3.73:80'

  } else if (window.location.hostname.indexOf('fat-1') !== -1) {
    return ' https://internal.fat-1.op-api-gateway.wonderlink.cc'
  } else {
    return 'https://op-api-gateway.wonder-link.net'
  }
}
export const downloadBlob = (fileName, url) => {
  const apiUrl = baseURLEnv() + url 
  axios.get(apiUrl, { responseType: 'blob', headers: { 'merchant-server-token': Local.get('token') } }).then(
    function (response) {
console.log(response.headers['content-disposition'].split('.')[1])
console.log(fileName)
      // const link = document.createElement('a')
      // const blob = new Blob([response.data])
      // link.style.display = 'none'
      // link.href = URL.createObjectURL(blob)
      // link.setAttribute('download', fileName +'.'+ response.headers['content-disposition'].split('.')[1])
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
    }

   
  )
}
