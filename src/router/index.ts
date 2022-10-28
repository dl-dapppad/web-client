import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.posts },
  },
  {
    path: '/categories',
    name: ROUTE_NAMES.posts,
    component: () => import('@/pages/PostsPage.vue'),
  },
  {
    path: '/category/:id',
    name: ROUTE_NAMES.categoryItem,
    component: () => import('@/pages/PostItemPage.vue'),
  },
  {
    path: '/product/:id',
    name: ROUTE_NAMES.productItem,
    component: () => import('@/pages/PostItemPage.vue'),
  },
  {
    path: '/product/:id/deploy',
    name: ROUTE_NAMES.productItemDeployment,
    component: () => import('@/forms/DeployForm.vue'),
  },
  {
    path: '/product/:id/edit',
    name: ROUTE_NAMES.productItemEditing,
    component: () => import('@/forms/EditForm.vue'),
  },
  {
    path: '/farming',
    name: ROUTE_NAMES.farming,
    component: () => import('@/pages/FarmingPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
