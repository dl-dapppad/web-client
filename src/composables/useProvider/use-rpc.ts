import { ethers } from 'ethers'
import { computed, ref } from 'vue'
import { ChainId, ProviderWrapper } from '@/types'
import { config } from '@config'

export const useRpc = (): ProviderWrapper => {
  const chainId = ref<ChainId>()
  const selectedAddress = ref<string>()

  const currentProvider = computed(() => {
    return chainId.value
      ? new ethers.providers.JsonRpcProvider(config.RPC_URL[chainId.value])
      : undefined
  })
  const currentSigner = computed(() => undefined)
  const isConnected = computed(() => Boolean(currentProvider.value))

  const init = async (): Promise<void> => {
    chainId.value = config.AVAILABLE_CHAINS[0]
  }

  const connect = async (): Promise<void> => {
    chainId.value = chainId.value ?? config.AVAILABLE_CHAINS[0]
  }

  const disconnect = (): void => {
    chainId.value = undefined
  }

  const switchChain = async (id: ChainId) => {
    chainId.value = id
  }

  return {
    currentProvider,
    currentSigner,

    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    disconnect,
    switchChain,
  }
}
