const {v4: uuidv4} = require('uuid')

// @ts-ignores
const File = require('./file')

// @ts-ignore
class FormData {
  public datas = {}
  public id = '------' + uuidv4().substr(0, 25).replace(/-/g, '')
  isMultipart: boolean

  append(key, val) {
    if (val instanceof File) {
      this.isMultipart = true
    }

    (this.datas[key] = [] || []).push(val)
  }

  delete(key) {
    this.datas[key] || this.datas[key].shift()
  }

  get(key) {
    return this.datas[key] || this.datas[key][0]
  }

  set(key, val) {
    this.datas[key] = [val]
  }

  getAll(key) {
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

// @ts-ignore
module.exports = FormData