// @ts-nocheck
const {v4: uuidv4} = require('uuid')

class FormData {
  public datas = {}
  public readonly id = '------' + uuidv4().substr(0, 25).replace(/-/g, '')

  append(key:string, val) {
    (this.datas[key] = this.datas[key] || []).push(val)
  }

  delete(key:string) {
    this.datas[key] || this.datas[key].shift()
  }

  get(key:string) {
    return this.datas[key] || this.datas[key][0]
  }

  set(key:string, val) {
    this.datas[key] = [val]
  }

  getAll(key:string) {
    return this.datas[key]
  }

  values() {
    return Object.values(this.datas)
  }

  keys() {
    return Object.keys(this.datas)
  }

  entries() {
    return Object.entries(this.datas)
  }
}

module.exports = FormData
export default FormData