import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'
import { existGuard, contractGuard } from '@/router/guards'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.main,
    component: () => import('@/pages/MainPage.vue'),
  },
  {
    path: '/categories/:id',
    name: ROUTE_NAMES.categories,
    beforeEnter: existGuard,
    component: () => import('@/pages/PostsPage.vue'),
  },
  {
    path: '/category/:id',
    name: ROUTE_NAMES.category,
    beforeEnter: existGuard,
    component: () => import('@/pages/PostItemPage.vue'),
  },
  {
    path: '/product/:id',
    name: ROUTE_NAMES.product,
    beforeEnter: existGuard,
    component: () => import('@/pages/PostItemPage.vue'),
  },
  {
    path: '/product/:id/deploy',
    name: ROUTE_NAMES.productDeploy,
    beforeEnter: existGuard,
    component: () => import('@/forms/DeployForm.vue'),
  },
  {
    path: '/product/:id/edit/:contractAddress',
    name: ROUTE_NAMES.productEdit,
    beforeEnter: contractGuard,
    component: () => import('@/forms/EditForm.vue'),
  },
  {
    path: '/farming',
    name: ROUTE_NAMES.farming,
    component: () => import('@/pages/FarmingPage.vue'),
  },
  {
    path: '/404',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/pages/Page404.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
