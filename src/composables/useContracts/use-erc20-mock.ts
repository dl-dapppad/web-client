import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { Erc20Mock, Erc20Mock__factory } from '@/types'

export interface Erc20MockContract {
  address: Ref<string>
  init: (address: string) => void
  mint: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useErc20Mock = (contractAddress?: string) => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Erc20Mock | undefined>()
  const _instance_rw = ref<Erc20Mock | undefined>()

  const address = ref('')
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

  const updateDecimals = async (): Promise<void> => {
    if (!_instance.value) return

    decimals.value = Number(await _instance.value.decimals())
  }

  const mint = async (args: Record<string, string>) => {
    if (!_instance_rw.value) return

    return _instance_rw.value.mint(args.to, args.amount)
  }

  if (contractAddress) init(contractAddress)

  return {
    init,

    decimals,
    address,

    updateDecimals,
    mint,
  }
}
