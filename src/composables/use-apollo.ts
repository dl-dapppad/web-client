import gql from 'graphql-tag'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { provideApolloClient } from '@/apollo'

type ApolloDeployedProduct = {
  id?: string
  alias?: string
  deployer?: string
  proxy?: string
  timestamp?: string
  price?: string
  cashback?: string
}

export type ApolloDeployedProducts = {
  products: ApolloDeployedProduct[] | undefined
  totalCount: number
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
          products (where: {alias: "${alias}"}, first: ${first}, skip: ${skip}, orderBy: timestamp, orderDirection: desc) {
            id
            deployer
            proxy
            timestamp
            price
            cashback
          }
          productCounter (id: "${alias}") {
            count
          }
        }
      `,
    )

    watch([result], () => {
      deployedProducts.value = {
        products: result.value.products,
        totalCount: result.value.productCounter?.count ?? 0,
      }
    })

    watch([error], () => {
      console.error(error.value?.message)
    })
  }

  return {
    deployedProduct,
    deployedProducts,

    getProduct,
    getDeployedProducts,
  }
}
