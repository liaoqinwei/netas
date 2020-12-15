// @ts-nocheck
const XMLHttpRequest = require('../xhr/XMLHttpRequest')
const FormData = require('../xhr/formData')
const File = require('../xhr/file')


let xhr = new XMLHttpRequest(),
    fd = new FormData()

xhr.timeout = 1
fd.append('name', 'zhangsan')
fd.append('age', '18')
fd.append('xxx', 'xxxdsa')
fd.append('file', new File('./xhr.ts'))

// xhr.open('post', 'http://192.168.200.184:9090/file')
// xhr.send(fd)

xhr.open('get','http://152.136.147.123:9090/recommend')
xhr.send(null)
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    // console.log(xhr.status, xhr.statusText)
    console.log(xhr.getAllResponseHeaders());
  }
}
