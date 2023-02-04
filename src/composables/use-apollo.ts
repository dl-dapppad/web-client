import gql from 'graphql-tag'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { provideApolloClient } from '@/apollo'
import { apolloClient } from '@/apollo'

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

export type ApolloAccountPools = {
  product: string
  totalPoints: string
}

export type ApolloPoolAccounts = {
  address: string
  points: string
}

export type ApolloPaymentTokens = {
  token: string
}

export const useApollo = () => {
  const deployedProduct = ref<ApolloDeployedProduct | undefined>()
  const deployedProducts = ref<ApolloDeployedProducts>({
    products: undefined,
    totalCount: 0,
  })

  const getProduct = (address: string) => {
    provideApolloClient()
    const { result, error } = useQuery(
      gql`
        query {
          productSales (where: {productProxyAddress: "${address}"}) {
            alias: id
          }
        }
      `,
    )

    watch([result], () => {
      deployedProduct.value = result.value.productSales[0]
    })

    watch([error], () => {
      console.error(error.value?.message)
    })
  }

  const getDeployedProducts = (alias: string, first: number, skip: number) => {
    provideApolloClient()
    const { result, error } = useQuery(
      gql`
        query {
          productSales (where: {id_contains: "${alias}"}, first: ${first}, skip: ${skip}, orderBy: timestamp, orderDirection: desc) {
            id
            user: userToProduct {
              address: user
            }
            proxy: productProxyAddress
            timestamp
            price: initialPrice
          }
          productCounter (id: "${alias}") {
            count: productSalesCount
          }
        }
      `,
    )

    watch([result], () => {
      deployedProducts.value = {
        products: result.value.productSales,
        totalCount: result.value.productCounter?.count ?? 0,
      }
    })

    watch([error], () => {
      console.error(error.value?.message)
    })
  }

  const getAccountPools = async (
    account: string,
  ): Promise<ApolloAccountPools[]> => {
    const query = gql`
      query {
        userToProducts (where: {user: "${account}"}, orderBy: totalPoints, orderDirection: desc) {
          product
          totalPoints
        }
      }
    `

    return (await apolloClient.query({ query })).data.userToProducts
  }

  const getPoolAccount = async (
    alias: string,
    account: string,
  ): Promise<ApolloPoolAccounts[]> => {
    const query = gql`
      query {
        userToProducts (where: {product: "${alias}", user: "${account}"}) {
          address: user
          points: totalPoints
        }
      }
    `

    return (await apolloClient.query({ query })).data.userToProducts
  }

  const getPoolAccounts = async (
    alias: string,
    first: number,
    skip: number,
    withoutAccount?: string,
  ): Promise<ApolloPoolAccounts[]> => {
    let whereQuery = `product: "${alias}"`
    if (withoutAccount) {
      whereQuery += `, user_not: "${withoutAccount}"`
    }

    const query = gql`
      query {
        userToProducts (where: {${whereQuery}}, first: ${first}, skip: ${skip}, orderBy: totalPoints, orderDirection: desc) {
          address: user
          points: totalPoints
        }
      }
    `

    return (await apolloClient.query({ query })).data.userToProducts
  }

  const getUsersInPoolCount = async (alias: string): Promise<number> => {
    const query = gql`
      query {
        productCounter (id: "${alias}") {
          count: usersBought
        }
      }
    `

    return (await apolloClient.query({ query })).data.productCounter.count
  }

  const getPaymentTokens = async (): Promise<ApolloPaymentTokens[]> => {
    const query = gql`
      query {
        paymentTokens {
          token: id
        }
      }
    `

    return (await apolloClient.query({ query })).data.paymentTokens
  }

  return {
    deployedProduct,
    deployedProducts,

    getProduct,
    getDeployedProducts,
    getAccountPools,
    getPoolAccount,
    getPoolAccounts,
    getUsersInPoolCount,
    getPaymentTokens,
  }
}
