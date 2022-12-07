import { PROVIDERS } from '@/enums'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useMetamask, useRpc } from '@/composables/useProvider'
import { DesignatedProvider, ChainId, ProviderWrapper } from '@/types'
import {
  getChain,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
} from '@/helpers'
import { errors } from '@/errors'
import { ethers } from 'ethers'

export interface UseProvider {
  currentProvider: ComputedRef<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | undefined
  >
  currentSigner: ComputedRef<ethers.providers.JsonRpcSigner | undefined>

  selectedProvider: Ref<PROVIDERS | undefined>
  chainId: ComputedRef<ChainId | undefined>
  selectedAddress: ComputedRef<string | undefined>
  isConnected: ComputedRef<boolean>

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  getTxUrl: (txHash: string) => string
  getAddressUrl: (address: string) => string
}

export const useProvider = (): UseProvider => {
  const _providerWrp = ref<ProviderWrapper | undefined>()

  const currentProvider = computed(
    () =>
      _providerWrp.value?.currentProvider as
        | ethers.providers.Web3Provider
        | ethers.providers.JsonRpcProvider
        | undefined,
  )
  const currentSigner = computed(
    () =>
      _providerWrp.value?.currentSigner as
        | ethers.providers.JsonRpcSigner
        | undefined,
  )

  const selectedProvider = ref<PROVIDERS | undefined>()
  const chainId = computed(
    () => _providerWrp.value?.chainId as ChainId | undefined,
  )
  const selectedAddress = computed(
    () => _providerWrp.value?.selectedAddress as string | undefined,
  )
  const isConnected = computed(() => Boolean(_providerWrp.value?.isConnected))

  const init = async (provider: DesignatedProvider) => {
    switch (provider.name) {
      case PROVIDERS.metamask:
        _providerWrp.value = useMetamask(provider.instance)
        break
      case PROVIDERS.rpc:
        _providerWrp.value = useRpc()
        break
      default:
        throw new errors.ProviderNotSupportedError()
    }

    selectedProvider.value = provider.name
    await _providerWrp.value.init()
  }

  const connect = async (): Promise<void> => {
    if (!_providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    await _providerWrp.value.connect()
  }

  const disconnect = (): void => {
    if (!_providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    _providerWrp.value.disconnect()
  }

  const switchChain = async (chainId: ChainId): Promise<void> => {
    if (!_providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    await _providerWrp.value.switchChain(chainId)
  }

  const addChain = async (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ): Promise<void> => {
    if (!_providerWrp.value || !_providerWrp.value?.addChain)
      throw new errors.ProviderWrapperMethodNotFoundError()

    await _providerWrp.value.addChain(chainId, chainName, chainRpcUrl)
  }

  const getTxUrl = (txHash: string): string => {
    return getEthExplorerTxUrl(_getExplorerUrl(), txHash)
  }

  const getAddressUrl = (address: string): string => {
    return getEthExplorerAddressUrl(_getExplorerUrl(), address)
  }

  const _getExplorerUrl = (): string => {
    if (!_providerWrp.value) {
      throw new errors.ProviderWrapperMethodNotFoundError()
    }

    if (!chainId.value) {
      throw new errors.ProviderChainNotFoundError()
    }

    const explorerUrl = getChain(chainId.value).explorerUrl
    if (!explorerUrl) throw new errors.ProviderChainNotFoundError()

    return explorerUrl
  }

  return {
    currentProvider,
    currentSigner,

    selectedProvider,
    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    disconnect,
    switchChain,
    addChain,
    getTxUrl,
    getAddressUrl,
  }
}
