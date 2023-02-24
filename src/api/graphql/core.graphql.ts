import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core'

import { config } from '@config'
import { useWeb3ProvidersStore } from '@/store'

const cache = new InMemoryCache()

export let coreApolloClient = {} as ApolloClient<NormalizedCacheObject>

export const getApolloClient = () => {
  const web3Store = useWeb3ProvidersStore()

  let chainId = web3Store.provider.chainId as string
  if (!web3Store.isCurrentChainAvailable) {
    chainId = web3Store.defaultChain
  }

  const client = new ApolloClient({
    link: createHttpLink({
      uri: config.URL_SUBGRAPH[chainId],
    }),
    cache,
  })
  coreApolloClient = client
  return client
}
