const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // 配置反向代理
  devServer:{
    proxy:{
      "/adminapi":{
        target:"http://127.0.0.1:3000",
        changeOrigin:true
      }
    }
  }
})

