# netas

The library that **netas** uses to send network requests, It can work in both browser and node environment, and their usage is the same

### install

Using npm

> $ npm install netas 

### use

in Node.js	

```js
// import netas
var netas = require('netas')

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

### upload file

if you need to upload single file

```js
var path = require('path')
var netas = require('netas')
var File = require('netas/File')


let config = {
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

```js
var path = require('path')
var netas = require('netas')
// import FormData and File ( in node )
var FormData = require('netas/FormData')
var File = require('netas/File')


var fd = new FormData
fd.append('file', new File(path.join(__dirname, './test.txt')))
fd.append('file', new File(path.join(__dirname, './test2.txt')))


let config = {
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

