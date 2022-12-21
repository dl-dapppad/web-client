export type Post = {
  id: string
  type: 'category' | 'product'
  subPosts: string[]
  bannerUrl: string
  imageUrl: string
  title: string
  description: string
  chartTitle: string
  chartDescription: string
  content: [string, string][]
  infoDescriptionContent?: [string, string][]
}
