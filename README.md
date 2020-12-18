# netas

The library that **netas** uses to send network requests, It can work in both browser and node environment, and their usage is the same

### install

Using npm

> $ npm install netas 

### use

in Node.js	

```javascript
// import netas
var netas = require('README')

// Just configure the URL
var config = {
  url: 'http://registry.npmjs.org/netas',
}

// use netas.request
netas.request(config).then(function (res) {
  // pass
}, function (err) {
  // pass
})


```

### upload file

if you need to upload single file

```javascript
var path = require('path')
var netas = require('README')
var File = require('netas/File')


var config = {
  method: 'post',
  dataType:"multipart",
  url: 'url',
  data: {file:new File(path.join(__dirname, './test.txt')) }
}

netas.request(config).then(function (res) {
  // pass
}, function (err) {
  // pass
})

```

files

```javascript
var path = require('path')
var netas = require('README')
// import FormData and File ( in node )
var FormData = require('netas/FormData')
var File = require('netas/File')


var fd = new FormData
fd.append('file', new File(path.join(__dirname, './test.txt')))
fd.append('file', new File(path.join(__dirname, './test2.txt')))


var config = {
  method: 'post',
  url: 'url',
  data: fd
}

netas.request(config).then(function (res) {
  // pass
}, function (err) {
  // pass
})
```

### in Web

```javascript
var netas  = require('netas/web')

var config = {
    url:'url'
}

netas.request(config).then(res=>{
  // pass
},(err)=>{
  // pass
})
```

### config

+ baseUrl

  The default request address, which will be spliced with the URL.

  >type: string
  >
  >default: ''

+ headers

  Request header

  >type: object
  >
  >default: {}

+ data

  Request volume data

  > type: FormData | object
  >
  > default: {}

+ cache

  Turn on HTTP weak cache

  > type: boolean
  >
  > default: true

+ params

  Query parameter

  > type: object
  >
  > default: {}

+ dataType

  Request volume data type

  > string: 'json' | 'multipart' |  ''
  >
  > default: 'json'

+ method

  HTTP request methods.

  > string: 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'
  >
  > default: 'get'

+ timeout

  The timeout of Ajax

  > type: number
  >
  > default: 1000 * 10	

+ responseType

  Returns the type of data

  > string: 'json' | 'text' | 'binary'
  >
  > default: 'json'

**Note:**

**Netas** doesn't test too much, it may still have bugs .

Please choose the latest version first, others may have bugs .