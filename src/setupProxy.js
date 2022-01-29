const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/zhuishu', {
    target: 'http://api.zhuishushenqi.com',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/zhuishu': ''
    }
  }))
}
