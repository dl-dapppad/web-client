import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { ERC20Common, ERC20Common__factory } from '@/modules/erc20/types'

export interface ProductErc20CommonContract {
  address: Ref<string>
  name: Ref<string>
  symbol: Ref<string>
  decimals: Ref<number>
  owner: Ref<string>
  totalSupply: Ref<string>
  init: (address: string) => void
  loadDetails: () => Promise<void>
  updateName: () => Promise<void>
  updateSymbol: () => Promise<void>
  updateDecimals: () => Promise<void>
  updateOwner: () => Promise<void>
  updateTotalSupply: () => Promise<void>
  balanceOf: (address: string) => Promise<string>
  allowance: (owner: string, spender: string) => Promise<string>
  approve: (args: Record<string, string>) => Promise<ContractTransaction>
  transfer: (args: Record<string, string>) => Promise<ContractTransaction>
  transferFrom: (args: Record<string, string>) => Promise<ContractTransaction>
  transferOwnership: (
    args: Record<string, string>,
  ) => Promise<ContractTransaction>
  upgradeTo: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useProductErc20Common = (
  contractAddress?: string,
): ProductErc20CommonContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC20Common | undefined>()
  const _instance_rw = ref<ERC20Common | undefined>()

  const address = ref('')
  const name = ref('')
  const symbol = ref('')
  const decimals = ref(0)
  const owner = ref('')
  const totalSupply = ref('')

  const init = (contractAddress: string): void => {
    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC20Common__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }

    if (provider.value.currentSigner) {
      _instance_rw.value = ERC20Common__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const loadDetails = async (): Promise<void> => {
    if (!_instance.value) return

    await Promise.all([
      updateName(),
      updateSymbol(),
      updateDecimals(),
      updateOwner(),
      updateTotalSupply(),
    ])
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

  const updateOwner = async (): Promise<void> => {
    if (!_instance.value) return

    owner.value = await _instance.value.owner()
  }

  const updateTotalSupply = async (): Promise<void> => {
    if (!_instance.value) return

    totalSupply.value = (await _instance.value.totalSupply()).toString()
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
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.approve(args.spender, args.amount)
  }

  const transfer = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.transfer(args.recipient, args.amount)
  }

  const transferFrom = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.transferFrom(
      args.sender,
      args.recipient,
      args.amount,
    )
  }

  const transferOwnership = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.transferOwnership(args.newOwner)
  }

  const upgradeTo = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.upgradeTo(args.implementation)
  }

  if (contractAddress) init(contractAddress)

  watch(
    () => provider.value.selectedAddress,
    () => {
      init(address.value)
    },
  )

  return {
    init,
    loadDetails,

    address,
    name,
    symbol,
    decimals,
    owner,
    totalSupply,

    updateName,
    updateSymbol,
    updateDecimals,
    updateOwner,
    updateTotalSupply,
    balanceOf,
    allowance,
    approve,
    transfer,
    transferFrom,
    transferOwnership,
    upgradeTo,
  }
}
