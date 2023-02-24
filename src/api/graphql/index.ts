import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { provideApolloClients } from '@vue/apollo-composable'
import { getApolloClient } from '@/api/graphql/core.graphql'

export function initGraphQlClients() {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const init = () => {
    provideApolloClients({
      default: getApolloClient(),
    })
  }

  watch(() => [provider.value.chainId], init)

  init()
}
