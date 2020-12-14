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
fd.append('file', new File('./file.ts'))

xhr.open('post', 'http://192.168.200.184:9090/file')
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4){
    console.log(xhr.status, xhr.statusText)
    console.dir(xhr.getAllResponseHeaders());
  }
}

xhr.send(fd)
