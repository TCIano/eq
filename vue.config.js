const { defineConfig } = require('@vue/cli-service')
const isProd = process.env.NODE_ENV === 'production'
module.exports = defineConfig({
  // transpileDependencies: true,
  publicPath: isProd ? './' : '/',
  // publicPath: '/equipmentWeb',
  assetsDir: 'static',
  lintOnSave: true,
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/faultPredict': {
        target: 'http://192.168.2.25:7801/', //请求的服务器地址
        // target: 'http://192.168.0.86:7801/', //请求的服务器地址
        // target: 'http://127.0.0.1:4523/m1/6640419-0-default/', //请求的服务器地址
        changeOrigin: true,
        // pathRewrite: { '^/faultPredict': '' }, //可以让发过去的请求不带打头
      },
      '/tianwei/message': {
        target: 'http://192.168.0.99:8085/',
        changeOrigin: true,
        pathRewrite: { '^/tianwei': '' },
      },
    },
  },
})
