const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
   transpileDependencies: true,
   lintOnSave: true,
   devServer: {
      proxy: {
         '/tianwei': {
            target: 'http://192.168.0.100:9001', //请求的服务器地址
            changeOrigin: true,
            // pathRewrite: { '^/twhg': '' }, //可以让发过去的请求不带打头
         },
      },
   },
})
