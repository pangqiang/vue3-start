import { createRouter, createWebHistory } from 'vue-router'
import  page1Route from "@/router/page1.route";
const routes = [
    page1Route,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
