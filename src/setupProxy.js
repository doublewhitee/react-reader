const { createProxyMiddleware } = require('http-proxy-middleware')

const zsFilter = (pathname) => {
  const path = pathname.replace(/\/.+?\/zhuishu/, '/zhuishu')
  return path.match('^/zhuishu')
}

const biquge1Filter = (pathname) => {
  const path = pathname.replace(/\/.+?\/biquge1/, '/biquge1')
  return path.match('^/biquge1')
}

const biquge2Filter = (pathname) => {
  const path = pathname.replace(/\/.+?\/biquge2/, '/biquge2')
  return path.match('^/biquge2')
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
  }));
  app.use(createProxyMiddleware(biquge1Filter, {
    target: 'https://sou.jiaston.com',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/biquge1': '',
      '/.+?/biquge1': ''
    }
  }));
  app.use(createProxyMiddleware(biquge2Filter, {
    target: 'http://shuapi.jiaston.com',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/biquge2': '',
      '/.+?/biquge2': ''
    }
  }))
}
