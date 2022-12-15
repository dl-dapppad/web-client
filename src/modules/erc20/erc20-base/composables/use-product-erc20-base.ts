import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { utils } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import {
  useProductErc20Common,
  ProductErc20CommonContract,
} from '@/modules/erc20/composables'
import { ERC20Base, ERC20Base__factory } from '@/modules/erc20/erc20-base/types'

export interface ProductErc20BaseContract extends ProductErc20CommonContract {
  encodeFunctionData: (
    initializeDataValues: unknown[],
    functionMethod?: string,
  ) => string
}

export const useProductErc20Base = (
  contractAddress?: string,
): ProductErc20BaseContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC20Base | undefined>()
  const _instance_rw = ref<ERC20Base | undefined>()

  const erc20Common = ref<ProductErc20CommonContract>(useProductErc20Common())

  const init = (contractAddress: string): void => {
    erc20Common.value.init(contractAddress)
    erc20Common.value.address = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC20Base__factory.connect(
        erc20Common.value.address,
        provider.value.currentProvider,
      )
    }

    if (provider.value.currentSigner) {
      _instance_rw.value = ERC20Base__factory.connect(
        erc20Common.value.address,
        provider.value.currentSigner,
      )
    }
  }

  const encodeFunctionData = (
    initializeDataValues: unknown[],
    functionMethod = 'ERC20_init',
  ): string => {
    const abiInterface = ERC20Base__factory.createInterface() as utils.Interface
    return abiInterface.encodeFunctionData(functionMethod, initializeDataValues)
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
  }
}
