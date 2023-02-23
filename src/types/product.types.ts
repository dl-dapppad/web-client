type ApolloDeployedProduct = {
  id?: string
  alias?: string
  user?: {
    address: string
  }
  proxy?: string
  timestamp?: string
  price?: string
}

export type ApolloDeployedProducts = {
  products: ApolloDeployedProduct[] | undefined
  totalCount: number
}

export type ApolloPoolAccounts = {
  address: string
  points: string
}
