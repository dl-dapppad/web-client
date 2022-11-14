/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTE_NAMES } from '@/enums'
import { Post } from '@/types'
import postsData from '@/assets/posts.json'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export const existGuard = (thingToCheck?: string) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const posts = postsData as Post[]

    if (!to?.params?.id) next(ROUTE_NAMES.notFound)

    const post = posts.find(post => to.params?.id === post.id)
    if (!post) next(ROUTE_NAMES.notFound)

    if (post?.subPosts.length !== 0 && thingToCheck === 'product')
      next(ROUTE_NAMES.notFound)
    if (post?.subPosts.length === 0 && thingToCheck === 'category')
      next(ROUTE_NAMES.notFound)

    next()
  }
}
