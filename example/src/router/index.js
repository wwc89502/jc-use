import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/index'
import About from '../views/about'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
