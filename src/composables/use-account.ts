import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { ref, watch } from 'vue'
import { useErc20 } from './useContracts'
import { CONTRACT_NAMES } from '@/enums'
import { config } from '@/config'

export const useAccount = () => {
  const web3Store = useWeb3ProvidersStore()
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const nativeBalance = ref('0')
  const dappBalance = ref('0')

  const init = () => {
    updateNativeBalance()
    updateDappBalance()
  }

  const updateNativeBalance = async () => {
    if (!provider.value.selectedAddress) return

    const balance = await provider.value.currentProvider?.getBalance(
      provider.value.selectedAddress,
    )

    if (!balance) return
    nativeBalance.value = balance.toString()
  }

  const updateDappBalance = async () => {
    if (!provider.value.selectedAddress || !provider.value.chainId) return

    const dapp = useErc20()
    dapp.init(config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.DAPP])

    dappBalance.value = await dapp.balanceOf(provider.value.selectedAddress)
  }

  watch(
    () => [provider.value.selectedAddress, provider.value.chainId],
    () => {
      if (web3Store.isCurrentChainAvailable) {
        updateNativeBalance()
        updateDappBalance()
      }
    },
  )

  init()

  return {
    nativeBalance,
    dappBalance,

    updateNativeBalance,
    updateDappBalance,
  }
}
