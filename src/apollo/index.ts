import { config } from '@/config'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { provideApolloClients } from '@vue/apollo-composable'

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  cache,
  uri: config.URL_SUBGRAPH,
})

export const provideApolloClient = () => {
  provideApolloClients({
    default: apolloClient,
  })
}
