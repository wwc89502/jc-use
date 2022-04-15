import { createRouter, createWebHashHistory } from 'vue-router'
import Fetch from '../views/fetch'
import Axios from '../views/axios'
import Poll from '../views/poll'

const routes = [
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
