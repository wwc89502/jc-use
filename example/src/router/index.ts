import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Fetch from '../views/fetch/index.vue'
import Axios from '../views/axios/index.vue'
import Poll from '../views/poll/index.vue'
import RAF from '../views/rAF/index.vue'

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
  },
  {
    path: '/rAF',
    name: 'rAF',
    component: RAF
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
