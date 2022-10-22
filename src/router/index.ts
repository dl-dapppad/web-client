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
    name: ROUTE_NAMES.postItem,
    component: () => import('@/pages/PostItemPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
