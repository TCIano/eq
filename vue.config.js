const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
   // transpileDependencies: true,
   publicPath: './',
   lintOnSave: true,
   devServer: {
      hot: true,
      proxy: {
         '/tianwei/message': {
            target: 'http://192.168.0.99:8085/',
            changeOrigin: true,
            pathRewrite: { '/tianwei': '' },
         },
         '/tianwei': {
            target: 'http://192.168.0.100:9001', //请求的服务器地址
            // target: 'http://192.168.0.235:9001', //请求的服务器地址
            // target: 'http://127.0.0.1:4523/m1/2242345-0-default', //请求的服务器地址
            changeOrigin: true,
            // pathRewrite: { '^/tianwei': '' }, //可以让发过去的请求不带打头
         },
      },
   },
})
