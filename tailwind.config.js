module.exports = {
   purge: false,
   theme: {
      extend: {},
   },
   variants: {},
   plugins: [
      // ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
   ],
   // 添加下面的代码,禁用 `清除浏览器默认样式`
   // (这样 `@tailwind base` 就只会添加一些默认的 tw 变量.不会去清除浏览器默认样式了.)
   //修改 Tailwind 导致 antd 的 button icon svg 不居中的 bug
   corePlugins: {
      preflight: false,
   },
   important: true,
}
