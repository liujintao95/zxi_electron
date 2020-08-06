import Vue from 'vue'
import VueRouter from 'vue-router'
import NetworkDisk from '../views/NetworkDisk.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'NetworkDisk',
    component: NetworkDisk
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('../views/Download.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/Upload.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router
