import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'
import { existGuard } from '@/router/guards'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.main,
    component: () => import('@/pages/MainPage.vue'),
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
    beforeEnter: existGuard,
    component: () => import('@/forms/EditForm.vue'),
  },
  {
    path: '/cashback',
    name: ROUTE_NAMES.cashback,
    component: () => import('@/pages/CashbackPage.vue'),
  },
  {
    path: '/terms-of-use',
    name: ROUTE_NAMES.termsOfUse,
    component: () => import('@/pages/PostItemPage.vue'),
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
