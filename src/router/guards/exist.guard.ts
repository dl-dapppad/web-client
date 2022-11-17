/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTE_NAMES } from '@/enums'
import { Post } from '@/types'
import postsData from '@/assets/posts.json'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export const existGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const posts = postsData as Post[]

  if (!to?.params?.id) next(ROUTE_NAMES.notFound)

  const post = posts.find(post => to.params?.id === post.id)
  if (!post) next(ROUTE_NAMES.notFound)

  if (
    post?.type === 'category' &&
    !['categories', 'category'].includes(to.name as string)
  )
    next(ROUTE_NAMES.notFound)

  if (
    post?.type === 'product' &&
    !['product', 'product-deploy', 'product-edit'].includes(to.name as string)
  )
    next(ROUTE_NAMES.notFound)

  next()
}
