const { defineConfig } = require('@vue/cli-service')
const isProd = process.env.NODE_ENV === 'production'
module.exports = defineConfig({
  // transpileDependencies: true,
  publicPath: isProd ? './' : '/',
  // publicPath: '/equipmentWeb',
  assetsDir: 'static',
  lintOnSave: true,
  devServer: {
    hot: true,
    proxy: {
      '/faultPredict': {
        target: 'http://192.168.2.25:7801/', //请求的服务器地址
        changeOrigin: true,
        // pathRewrite: { '^/tianwei': '' }, //可以让发过去的请求不带打头
      },
      '/tianwei/message': {
        target: 'http://192.168.0.99:8085/',
        changeOrigin: true,
        pathRewrite: { '^/tianwei': '' },
      },

    },
  },
})
