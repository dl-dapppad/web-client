import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Erc20Mock, Erc20Mock__factory } from '@/types'

export const useErc20Mock = (contractAddress?: string) => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Erc20Mock | undefined>()
  const _instance_rw = ref<Erc20Mock | undefined>()

  const address = ref('')
  const name = ref('')
  const symbol = ref('')
  const decimals = ref(0)

  const init = (contractAddress: string): void => {
    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = Erc20Mock__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = Erc20Mock__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const mint = async (address: string) => {
    if (!_instance.value) return

    await _instance.value.mint(address, '10000')
  }

  if (contractAddress) init(contractAddress)

  return {
    init,

    address,
    name,
    symbol,
    decimals,

    mint,
  }
}
