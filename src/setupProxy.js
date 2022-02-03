const { createProxyMiddleware } = require('http-proxy-middleware')

const zsFilter = (pathname) => {
  const path = pathname.replace(/\/.+?\/zhuishu/, '/zhuishu')
  return path.match('^/zhuishu')
}

module.exports = (app) => {
  app.use(createProxyMiddleware(zsFilter, {
    target: 'http://api.zhuishushenqi.com',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/zhuishu': '',
      '/.+?/zhuishu': ''
    }
  }))
}
