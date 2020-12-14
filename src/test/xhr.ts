// @ts-ignore
const XMLHttpRequest = require('../xhr/XMLHttpRequest')
// @ts-ignore
const FormData = require('../xhr/formData')
// @ts-ignore
const File = require('../xhr/file')


let xhr = new XMLHttpRequest(),
    fd = new FormData()

fd.append('name', 'zhangsan')
fd.append('age', '18')
fd.append('xxx', 'xxxdsa')
// @ts-ignore
fd.append('file', new File('./xhr.ts'))

xhr.open('post', 'http://127.0.0.1:3000/file')
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    console.log(xhr.status, xhr.statusText)
    console.dir(xhr.getAllResponseHeaders())
  }
}
xhr.send(fd)
