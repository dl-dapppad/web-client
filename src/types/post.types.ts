export type Post = {
  id: string
  title: string
  description: string
  checklist?: [string, boolean][]
  chartTitle: string
  chartDescription: string
  content: [string, string][]
  infoDescriptionContent?: [string, string][]
}
