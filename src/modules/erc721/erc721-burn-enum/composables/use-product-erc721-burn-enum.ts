import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { utils, ContractTransaction } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import { errors } from '@/errors'
import {
  useProductErc721Common,
  ProductErc721CommonContract,
} from '@/modules/erc721/composables'
import {
  ERC721BurnEnum,
  ERC721BurnEnum__factory,
} from '@/modules/erc721/erc721-burn-enum/types'

export interface ProductErc721BurnEnumContract
  extends ProductErc721CommonContract {
  encodeFunctionData: (
    initializeDataValues: unknown[],
    functionMethod?: string,
  ) => string
  tokenByIndex: (index: string) => Promise<string>
  tokenOfOwnerByIndex: (owner: string, index: string) => Promise<string>
  burn: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useProductErc721BurnEnum = (
  contractAddress?: string,
): ProductErc721BurnEnumContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC721BurnEnum | undefined>()
  const _instance_rw = ref<ERC721BurnEnum | undefined>()

  const erc721Common = ref<ProductErc721CommonContract>(
    useProductErc721Common(),
  )

  const init = (contractAddress: string): void => {
    erc721Common.value.init(contractAddress)
    erc721Common.value.address = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC721BurnEnum__factory.connect(
        erc721Common.value.address,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = ERC721BurnEnum__factory.connect(
        erc721Common.value.address,
        provider.value.currentSigner,
      )
    }
  }

  const encodeFunctionData = (
    initializeDataValues: unknown[],
    functionMethod = 'ERC721BurnEnum_init',
  ): string => {
    const abiInterface =
      ERC721BurnEnum__factory.createInterface() as utils.Interface
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

  const burn = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.burn(args.tokenId)
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
    burn,
  }
}
