import { ref } from 'vue'
import { ethers } from 'ethers'
import { Erc20Contract } from '@/types'
import { Erc20, Erc20__factory } from '@/types'

export const useErc20 = (
  currentProvider?: ethers.providers.Web3Provider,
  currentSigner?: ethers.providers.JsonRpcSigner,
  address?: string,
): Erc20Contract => {
  const _instance = ref<Erc20 | undefined>()
  const _instance_rw = ref<Erc20 | undefined>()

  const init = (contractAddress: string): void => {
    address = contractAddress

    if (currentProvider) {
      _instance.value = Erc20__factory.connect(contractAddress, currentProvider)
    }
    if (currentSigner) {
      _instance_rw.value = Erc20__factory.connect(
        contractAddress,
        currentSigner,
      )
    }
  }

  if (address) init(address ?? '')

  const name = ref('')
  const symbol = ref('')
  const decimals = ref(0)

  const loadDetails = async (): Promise<void> => {
    if (!_instance.value) return

    await Promise.all([updateName(), updateSymbol(), updateDecimals()])
  }

  const getAddress = (): string => {
    return address ?? ''
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

  return {
    init,
    loadDetails,
    getAddress,

    name,
    symbol,
    decimals,

    updateName,
    updateSymbol,
    updateDecimals,
    balanceOf,
  }
}
