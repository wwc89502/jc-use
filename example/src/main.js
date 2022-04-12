import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { globalConfig } from '../../index'

globalConfig.setData({
  baseURL: 'http://192.168.1.5:8800'
})
console.log(globalConfig.value)

createApp(App).use(store).use(router).mount('#app')
