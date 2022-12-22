import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { utils } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import {
  useProductErc721Common,
  ProductErc721CommonContract,
} from '@/modules/erc721/composables'
import {
  ERC721Enum,
  ERC721Enum__factory,
} from '@/modules/erc721/erc721-enum/types'

export interface ProductErc721EnumContract extends ProductErc721CommonContract {
  encodeFunctionData: (
    initializeDataValues: unknown[],
    functionMethod?: string,
  ) => string
  tokenByIndex: (index: string) => Promise<string>
  tokenOfOwnerByIndex: (owner: string, index: string) => Promise<string>
}

export const useProductErc721Enum = (
  contractAddress?: string,
): ProductErc721EnumContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC721Enum | undefined>()
  const _instance_rw = ref<ERC721Enum | undefined>()

  const erc721Common = ref<ProductErc721CommonContract>(
    useProductErc721Common(),
  )

  const init = (contractAddress: string): void => {
    erc721Common.value.init(contractAddress)
    erc721Common.value.address = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC721Enum__factory.connect(
        erc721Common.value.address,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = ERC721Enum__factory.connect(
        erc721Common.value.address,
        provider.value.currentSigner,
      )
    }
  }

  const encodeFunctionData = (
    initializeDataValues: unknown[],
    functionMethod = 'ERC721Enum_init',
  ): string => {
    const abiInterface =
      ERC721Enum__factory.createInterface() as utils.Interface
    return abiInterface.encodeFunctionData(functionMethod, initializeDataValues)
  }

  const tokenByIndex = async (index: string): Promise<string> => {
    if (!_instance.value) return ''

    return (await _instance.value.tokenByIndex(index)).toString()
  }

  const tokenOfOwnerByIndex = async (
    owner: string,
    index: string,
  ): Promise<string> => {
    if (!_instance.value) return ''

    return (await _instance.value.tokenOfOwnerByIndex(owner, index)).toString()
  }

  if (contractAddress) init(contractAddress)

  watch(
    () => provider.value.selectedAddress,
    () => {
      init(erc721Common.value.address)
    },
  )

  return {
    init,
    loadDetails: erc721Common.value.loadDetails,

    address: computed(() => erc721Common.value.address),
    name: computed(() => erc721Common.value.name),
    symbol: computed(() => erc721Common.value.symbol),
    baseURI: computed(() => erc721Common.value.baseURI),
    owner: computed(() => erc721Common.value.owner),

    updateName: erc721Common.value.updateName,
    updateSymbol: erc721Common.value.updateSymbol,
    updateBaseURI: erc721Common.value.updateBaseURI,
    updateOwner: erc721Common.value.updateOwner,
    balanceOf: erc721Common.value.balanceOf,
    ownerOf: erc721Common.value.ownerOf,
    tokenURI: erc721Common.value.tokenURI,
    isApprovedForAll: erc721Common.value.isApprovedForAll,
    getApproved: erc721Common.value.getApproved,
    approve: erc721Common.value.approve,
    setApprovalForAll: erc721Common.value.setApprovalForAll,
    safeTransferFrom: erc721Common.value.safeTransferFrom,
    safeMint: erc721Common.value.safeMint,
    setBaseURI: erc721Common.value.setBaseURI,
    transferOwnership: erc721Common.value.transferOwnership,
    upgradeTo: erc721Common.value.upgradeTo,

    encodeFunctionData,
    tokenByIndex,
    tokenOfOwnerByIndex,
  }
}
