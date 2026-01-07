const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const options = {
  target: 'http://127.0.0.1:8080',
  cookieDomainRewrite: 'dev-maps.com',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function (proxyReq, req, res) {
    if (!req.headers['accept-language']) {
      proxyReq.setHeader('Accept-Language', 'es-ES,es;q=0.9,en;q=0.8');
    } else {
      proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
    }
  }
};

app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:8080',
  changeOrigin: true,
  logLevel: 'debug'
}))

app.use('/admin', createProxyMiddleware({
  target: 'http://localhost:5171',
  changeOrigin: true
}))

app.use('/', createProxyMiddleware({
  target: 'http://localhost:5177',
  changeOrigin: true
}))


app.listen(80, '127.0.0.1');