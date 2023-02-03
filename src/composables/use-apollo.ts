import gql from 'graphql-tag'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { provideApolloClient } from '@/apollo'

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

export const useApollo = () => {
  const deployedProduct = ref<ApolloDeployedProduct | undefined>()
  const deployedProducts = ref<ApolloDeployedProducts>({
    products: undefined,
    totalCount: 0,
  })
  const accountPools = ref<ApolloAccountPools[]>([])

  const getProduct = (address: string) => {
    provideApolloClient()
    const { result, error } = useQuery(
      gql`
        query {
          product (id: "${address}") {
            alias
          }
        }
      `,
    )

    watch([result], () => {
      deployedProduct.value = result.value.product
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

  const getAccountPools = (account: string) => {
    provideApolloClient()
    const { result, error } = useQuery(
      gql`
        query {
          userToProducts (where: {user: "${account}"}, orderBy: totalPoints, orderDirection: desc) {
            product
            totalPoints
          }
        }
      `,
    )

    watch([result], () => {
      accountPools.value = result.value.userToProducts
    })

    watch([error], () => {
      console.error(error.value?.message)
    })
  }

  return {
    deployedProduct,
    deployedProducts,
    accountPools,

    getProduct,
    getDeployedProducts,
    getAccountPools,
  }
}
