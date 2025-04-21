import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import page1Route from './page1.route'

const routes: RouteRecordRaw[] = [page1Route]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
