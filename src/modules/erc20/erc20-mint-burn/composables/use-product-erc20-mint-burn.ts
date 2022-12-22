import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { utils, ContractTransaction } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import { errors } from '@/errors'
import {
  useProductErc20Common,
  ProductErc20CommonContract,
} from '@/modules/erc20/composables'
import {
  ERC20MintBurn,
  ERC20MintBurn__factory,
} from '@/modules/erc20/erc20-mint-burn/types'

export interface ProductErc20MintBurnContract
  extends ProductErc20CommonContract {
  encodeFunctionData: (
    initializeDataValues: unknown[],
    functionMethod?: string,
  ) => string
  mint: (args: Record<string, string>) => Promise<ContractTransaction>
  burn: (args: Record<string, string>) => Promise<ContractTransaction>
  burnFrom: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useProductErc20MintBurn = (
  contractAddress?: string,
): ProductErc20MintBurnContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC20MintBurn | undefined>()
  const _instance_rw = ref<ERC20MintBurn | undefined>()

  const erc20Common = ref<ProductErc20CommonContract>(useProductErc20Common())

  const init = (contractAddress: string): void => {
    erc20Common.value.init(contractAddress)
    erc20Common.value.address = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC20MintBurn__factory.connect(
        erc20Common.value.address,
        provider.value.currentProvider,
      )
    }

    if (provider.value.currentSigner) {
      _instance_rw.value = ERC20MintBurn__factory.connect(
        erc20Common.value.address,
        provider.value.currentSigner,
      )
    }
  }

  const encodeFunctionData = (
    initializeDataValues: unknown[],
    functionMethod = 'ERC20MintBurn_init',
  ): string => {
    const abiInterface =
      ERC20MintBurn__factory.createInterface() as utils.Interface
    return abiInterface.encodeFunctionData(functionMethod, initializeDataValues)
  }

  const mint = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.mint(args.recipient, args.amount)
  }

  const burn = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.burn(args.amount)
  }

  const burnFrom = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.burnFrom(args.account, args.amount)
  }

  if (contractAddress) init(contractAddress)

  watch(
    () => provider.value.selectedAddress,
    () => {
      init(erc20Common.value.address)
    },
  )

  return {
    init,
    loadDetails: erc20Common.value.loadDetails,

    address: computed(() => erc20Common.value.address),
    name: computed(() => erc20Common.value.name),
    symbol: computed(() => erc20Common.value.symbol),
    decimals: computed(() => erc20Common.value.decimals),
    owner: computed(() => erc20Common.value.owner),
    totalSupply: computed(() => erc20Common.value.totalSupply),

    updateName: erc20Common.value.updateName,
    updateSymbol: erc20Common.value.updateSymbol,
    updateDecimals: erc20Common.value.updateDecimals,
    updateOwner: erc20Common.value.updateOwner,
    updateTotalSupply: erc20Common.value.updateTotalSupply,
    balanceOf: erc20Common.value.balanceOf,
    allowance: erc20Common.value.allowance,
    approve: erc20Common.value.approve,
    transfer: erc20Common.value.transfer,
    transferFrom: erc20Common.value.transferFrom,
    transferOwnership: erc20Common.value.transferOwnership,
    upgradeTo: erc20Common.value.upgradeTo,

    encodeFunctionData,
    mint,
    burn,
    burnFrom,
  }
}
