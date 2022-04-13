import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { globalConfig } from 'jc-use'

globalConfig.setData({
  baseURL: 'http://10.101.114.5:8800',
  apiDict: {
    noAllowCodes: [403]
  }
})
console.log(globalConfig.value)

createApp(App).use(store).use(router).mount('#app')
