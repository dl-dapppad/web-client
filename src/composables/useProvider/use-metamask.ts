import { ethers } from 'ethers'
import {
  handleEthError,
  connectEthAccounts,
  requestAddEthChain,
  requestSwitchEthChain,
  isChainAvailable,
} from '@/helpers'
import { computed, ref } from 'vue'
import {
  EthProviderRpcError,
  ChainId,
  ProviderInstance,
  ProviderWrapper,
} from '@/types'

export const useMetamask = (provider: ProviderInstance): ProviderWrapper => {
  const chainId = ref<ChainId>()
  const selectedAddress = ref<string>()

  const currentProvider = computed(
    () =>
      new ethers.providers.Web3Provider(
        provider as ethers.providers.ExternalProvider,
        'any',
      ),
  )
  const currentSigner = computed(() => currentProvider.value.getSigner())

  const isConnected = computed(() =>
    Boolean(
      selectedAddress.value && chainId.value && isChainAvailable(chainId.value),
    ),
  )

  const init = async (): Promise<void> => {
    _setListeners()
    await _updateProviderState()
  }

  const _setListeners = (): void => {
    const tempProviderStub = currentProvider.value.provider as {
      on: (eventName: string, cb: () => void) => void
    }

    tempProviderStub.on('accountsChanged', () => {
      _updateProviderState()
    })
    tempProviderStub.on('chainChanged', () => {
      _updateProviderState()
    })
    tempProviderStub.on('disconnect', () => {
      selectedAddress.value = ''
    })
  }

  const connect = async (): Promise<void> => {
    await connectEthAccounts(currentProvider.value)
    await _updateProviderState()
  }

  const disconnect = (): void => {
    selectedAddress.value = ''
  }

  const switchChain = async (chainId: ChainId): Promise<void> => {
    try {
      await requestSwitchEthChain(currentProvider.value, Number(chainId))
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const addChain = async (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => {
    try {
      await requestAddEthChain(
        currentProvider.value,
        Number(chainId),
        chainName,
        chainRpcUrl,
      )
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const _updateProviderState = async () => {
    try {
      const network = await currentProvider.value.detectNetwork()
      chainId.value = network.chainId

      const currentAccounts = await currentProvider.value.listAccounts()
      selectedAddress.value = currentAccounts[0]
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
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
    addChain,
  }
}
