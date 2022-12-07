import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { ERC721, ERC721__factory } from '../types'

export interface ProductErc721Contract {
  address: Ref<string>
  name: Ref<string>
  symbol: Ref<string>
  baseURI: Ref<string>
  owner: Ref<string>
  init: (address: string) => void
  loadDetails: () => Promise<void>
  updateName: () => Promise<void>
  updateSymbol: () => Promise<void>
  updateBaseURI: () => Promise<void>
  updateOwner: () => Promise<void>
  balanceOf: (owner: string) => Promise<string>
  ownerOf: (tokenId: string) => Promise<string>
  tokenURI: (tokenId: string) => Promise<string>
  isApprovedForAll: (owner: string, operator: string) => Promise<boolean>
  getApproved: (tokenId: string) => Promise<string>
  approve: (args: Record<string, string>) => Promise<ContractTransaction>
  setApprovalForAll: (
    args: Record<string, string>,
  ) => Promise<ContractTransaction>
  safeTransferFrom: (
    args: Record<string, string>,
  ) => Promise<ContractTransaction>
  safeMint: (args: Record<string, string>) => Promise<ContractTransaction>
  setBaseURI: (args: Record<string, string>) => Promise<ContractTransaction>
  transferOwnership: (
    args: Record<string, string>,
  ) => Promise<ContractTransaction>
  upgradeTo: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useProductErc721 = (
  contractAddress?: string,
): ProductErc721Contract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ERC721 | undefined>()
  const _instance_rw = ref<ERC721 | undefined>()

  const address = ref('')
  const name = ref('')
  const symbol = ref('')
  const baseURI = ref('')
  const owner = ref('')

  const init = (contractAddress: string): void => {
    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = ERC721__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = ERC721__factory.connect(
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
      updateBaseURI(),
      updateOwner(),
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

  const updateBaseURI = async (): Promise<void> => {
    if (!_instance.value) return

    baseURI.value = await _instance.value.baseURI()
  }

  const updateOwner = async (): Promise<void> => {
    if (!_instance.value) return

    owner.value = await _instance.value.owner()
  }

  const balanceOf = async (owner: string): Promise<string> => {
    if (!_instance.value) return '0'

    return (await _instance.value.balanceOf(owner)).toString()
  }

  const ownerOf = async (tokenId: string): Promise<string> => {
    if (!_instance.value) return ''

    return _instance.value.ownerOf(tokenId)
  }

  const tokenURI = async (tokenId: string): Promise<string> => {
    if (!_instance.value) return ''

    return await _instance.value.tokenURI(tokenId)
  }

  const isApprovedForAll = async (
    owner: string,
    operator: string,
  ): Promise<boolean> => {
    if (!_instance.value) return false

    return _instance.value.isApprovedForAll(owner, operator)
  }

  const getApproved = async (tokenId: string): Promise<string> => {
    if (!_instance.value) return '0'

    return _instance.value.getApproved(tokenId)
  }

  const approve = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.approve(args.to, args.tokenId)
  }

  const setApprovalForAll = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.setApprovalForAll(
      args.operator,
      Boolean(args.approved),
    )
  }

  const safeTransferFrom = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value['safeTransferFrom(address,address,uint256)'](
      args.from,
      args.to,
      args.tokenId,
    )
  }

  const safeMint = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.safeMint(args.to, args.tokenId)
  }

  const setBaseURI = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new Error('Undefined instance')

    return _instance_rw.value.setBaseURI(args.baseURI)
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
    baseURI,
    owner,

    updateName,
    updateSymbol,
    updateBaseURI,
    updateOwner,
    balanceOf,
    ownerOf,
    tokenURI,
    isApprovedForAll,
    getApproved,
    approve,
    setApprovalForAll,
    safeTransferFrom,
    safeMint,
    setBaseURI,
    transferOwnership,
    upgradeTo,
  }
}
