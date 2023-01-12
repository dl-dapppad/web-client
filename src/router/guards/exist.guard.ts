/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import { Post } from '@/types'
import postsData from '@/assets/posts.json'

export const existGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const posts = postsData as unknown as Post[]

  if (!to?.params?.id) next(ROUTE_NAMES.notFound)

  const post = posts.find(post => to.params?.id === post.id)
  if (!post) next(ROUTE_NAMES.notFound)

  if (
    !['product', 'product-deploy', 'product-edit'].includes(to.name as string)
  )
    next(ROUTE_NAMES.notFound)

  next()
}
