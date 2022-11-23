/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { ROUTE_NAMES, PRODUCT_IDS } from '@/enums'
import { Post } from '@/types'
import { isErc20Contract, isErc721Contract } from '@/helpers'
import { ethers } from 'ethers'
import postsData from '@/assets/posts.json'

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

export const contractGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (
    !to.params.id ||
    !to.params.contractAddress ||
    !ethers.utils.isAddress(to.params.contractAddress as string)
  )
    next(ROUTE_NAMES.notFound)

  if (
    (await isErc20Contract(to.params.contractAddress as string)) &&
    to.params.id === PRODUCT_IDS.ERC20
  )
    next()
  else if (
    (await isErc721Contract(to?.params?.contractAddress as string)) &&
    to.params.id === PRODUCT_IDS.ERC721
  )
    next()
  else next(ROUTE_NAMES.notFound)
}
