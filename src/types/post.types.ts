export type Post = {
  id: string
  type: string
  subPosts: string[]
  bannerUrl: string
  imageUrl: string
  title: string
  description: string
  chartTitle: string
  chartDescription: string
  content: [string, string][]
}
