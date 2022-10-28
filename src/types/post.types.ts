import { config } from '@/config'

export type Post = {
  id: string
  title: string
  description: string
  imageUrl: string
  bannerUrl: string
  content: [string, string][]
  module?: typeof config.MODULES
}
