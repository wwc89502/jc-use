import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { globalConfig } from '../../index'

globalConfig.setData({
  baseURL: 'http://10.101.114.5:8800'
})
console.log(globalConfig)

createApp(App).use(store).use(router).mount('#app')
