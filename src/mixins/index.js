
import { downloadBlob } from '@/utils/downLoad'

export default {
  data() {
    return {
      displayedBtn: false,
      num: 60
    }
  },
  methods: {
    exportList(fileName, url, params = {}) {
      downloadBlob(fileName, url, params)
    },
    objectToQuery() {
      const obj = arguments[0]
      const prefix = arguments[1]
      if (typeof obj !== 'object') return ''
      const attrs = Object.keys(obj)
      return attrs.reduce((query, attr, index) => {
        if (index === 0 && !prefix) query += '?'
        if (typeof obj[attr] === 'object') {
          const subPrefix = prefix ? `${prefix}[${attr}]` : attr
          query += this.objectToQuery(obj[attr], subPrefix)
        } else {
          if (prefix) {
            query += `${prefix}[${attr}]=${obj[attr]}`
          } else {
            query += `${attr}=${obj[attr]}`
          }
        }
        if (index !== attrs.length - 1) query += '&'
        return query
      }, '')
    },
    exportExcel(fileName, url, params) {
      console.log(fileName, url, params, 'fileName, url, params')
      this.displayedBtn = true
      if (this.displayedBtn) {
        this.exportList(fileName, url, params)
      }
      this.timer = window.setInterval(() => {
        if (this.num > 0) {
          this.displayedBtn = true
          this.num--
        } else {
          this.displayedBtn = false
        }
      }, 1000)
    }
  }
}
