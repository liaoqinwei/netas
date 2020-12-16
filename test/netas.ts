const netas = require('../index')

netas.request({url: 'http://152.136.147.123:9090/recommend'}).then(res => {
  console.log(res)
})