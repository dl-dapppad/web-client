import { provideApolloClients } from '@vue/apollo-composable'
import { init } from '@/api/graphql/core.graphql'

export function initGraphQlClients() {
  provideApolloClients({
    default: init(),
  })
}
