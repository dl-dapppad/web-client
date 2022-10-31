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
    path: '/products/:id',
    name: ROUTE_NAMES.postItem,
    component: () => import('@/pages/PostItemPage.vue'),
  },
  {
    path: '/products/:id/deploy',
    name: ROUTE_NAMES.postItemDeployment,
    component: () => import('@/forms/DeployForm.vue'),
  },
  {
    path: '/products/:id/edit',
    name: ROUTE_NAMES.postItemEditing,
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
