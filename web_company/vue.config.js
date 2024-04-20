const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // 配置反向代理(企业门户官网)
  devServer:{
    proxy:{
      "/webapi":{
        target:"http://localhost:3000",
        changeOrigin:true
      }
    }
  }
})

