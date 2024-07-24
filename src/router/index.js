import { createRouter, createWebHistory } from 'vue-router'
import  page1Route from "@/router/page1.route";
import  page2Route from "@/router/page2.route";
const routes = [
    page1Route,
    page2Route
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
