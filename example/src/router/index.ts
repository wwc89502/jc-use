import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Fetch from '../views/fetch/index.vue'
import Axios from '../views/axios/index.vue'
import Poll from '../views/poll/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'fetch',
    component: Fetch
  },
  {
    path: '/axios',
    name: 'axios',
    component: Axios
  },
  {
    path: '/poll',
    name: 'poll',
    component: Poll
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
