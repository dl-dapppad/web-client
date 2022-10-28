import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { Erc20, Erc20__factory } from '@/types'

export interface Erc20Contract {
  address: Ref<string>
  name: Ref<string>
  symbol: Ref<string>
  decimals: Ref<number>
  init: (address: string) => void
  loadDetails: () => Promise<void>
  updateName: () => Promise<void>
  updateSymbol: () => Promise<void>
  updateDecimals: () => Promise<void>
  balanceOf: (address: string) => Promise<string>
  allowance: (owner: string, spender: string) => Promise<string>
  approve: (spender: string, amount: string) => Promise<ContractTransaction>
}

export const useErc20 = (contractAddress?: string): Erc20Contract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Erc20 | undefined>()
  const _instance_rw = ref<Erc20 | undefined>()

  const address = ref('')
  const name = ref('')
  const symbol = ref('')
  const decimals = ref(0)

  const init = (contractAddress: string): void => {
    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = Erc20__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = Erc20__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const loadDetails = async (): Promise<void> => {
    if (!_instance.value) return

    await Promise.all([updateName(), updateSymbol(), updateDecimals()])
  }

  const updateName = async (): Promise<void> => {
    if (!_instance.value) return

    name.value = await _instance.value.name()
  }

  const updateSymbol = async (): Promise<void> => {
    if (!_instance.value) return

    symbol.value = await _instance.value.symbol()
  }

  const updateDecimals = async (): Promise<void> => {
    if (!_instance.value) return

    decimals.value = Number(await _instance.value.decimals())
  }

  const balanceOf = async (address: string): Promise<string> => {
    if (!_instance.value) return '0'

    return (await _instance.value.balanceOf(address)).toString()
  }

  const allowance = async (owner: string, spender: string): Promise<string> => {
    if (!_instance.value) return '0'

    return (await _instance.value.allowance(owner, spender)).toString()
  }

  const approve = async (
    spender: string,
    amount: string,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.approve(spender, amount)
  }

  if (contractAddress) init(contractAddress)

  return {
    init,
    loadDetails,

    address,
    name,
    symbol,
    decimals,

    updateName,
    updateSymbol,
    updateDecimals,
    balanceOf,
    allowance,
    approve,
  }
}
