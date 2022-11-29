/* eslint-disable @typescript-eslint/no-explicit-any */

import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import {
  useErc20,
  useProductFactory,
  Erc20Contract,
  useFarming,
  Product,
} from '@/composables'
import { getMaxUint256, txWrapper } from '@/helpers'
import { BN } from '@/utils'
import { Interface } from 'ethers/lib/utils'
import { config } from '@/config'

import erc20Abi from '@/modules/erc20/erc20/abi/ERC20.json'
import erc721Abi from '@/modules/erc721/erc721/abi/ERC721.json'
import { PRODUCT_IDS } from '@/enums'

export const deploy = async (
  productId: string,
  paymentTokenAddress: string,
  initializeDataValues: any[],
): Promise<string> => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  if (!provider.value.chainId || !provider.value.selectedAddress)
    throw new Error('Provider is not set')

  const alias = config.PRODUCT_ALIASES[productId as string]
  const initializeData = getInitializeData(productId, initializeDataValues)
  const factory = useProductFactory()
  const product = await getProduct(alias)
  const paymentContractAddress = await factory.payment()

  const paymentTokenContract = useErc20(paymentTokenAddress)
  const isApproved = await approve(
    paymentTokenContract,
    provider.value.selectedAddress as string,
    paymentContractAddress,
    product.currentPrice,
  )
  if (!isApproved) return ''

  const potentialContractAddress = await factory.getPotentialContractAddress(
    alias,
    initializeData,
    provider.value.selectedAddress,
  )

  const txSucces = await txWrapper(factory.deploy, {
    alias,
    paymentToken: paymentTokenAddress,
    initializeData,
  })

  if (!txSucces) return ''

  await useAccountStore().updateDappBalance()

  return potentialContractAddress
}

export const getProduct = async (alias: string): Promise<Product> => {
  const factory = useProductFactory()

  return factory.products(alias)
}

const approve = async (
  paymentTokenContract: Erc20Contract,
  address: string,
  paymentContractAddress: string,
  productPrice: string,
): Promise<boolean> => {
  const allowance = await paymentTokenContract.allowance(
    address,
    paymentContractAddress,
  )

  if (new BN(allowance).compare(productPrice) >= 0) return true

  return txWrapper(paymentTokenContract.approve, {
    spender: paymentContractAddress,
    amount: getMaxUint256(),
  })
}

const getInitializeData = (productId: string, initializeDataValues: any[]) => {
  let abi = []
  let callMethod = ''
  switch (productId) {
    case PRODUCT_IDS.ERC20:
      abi = erc20Abi
      callMethod = 'ERC20_init'
      break
    case PRODUCT_IDS.ERC721:
      abi = erc721Abi
      callMethod = 'ERC721_init'
      break
    default:
      throw new Error('Product ID is not found')
  }

  return new Interface(abi).encodeFunctionData(callMethod, initializeDataValues)
}

export const getAvailableTokenList = async (): Promise<
  Record<string, Array<string>>
> => {
  const farming = useFarming()

  await farming.loadDetails()

  const mainPaymentToken = useErc20(farming.rewardToken.value)
  await mainPaymentToken.loadDetails()

  return {
    symbols: [mainPaymentToken.symbol.value],
    addresses: [mainPaymentToken.address.value],
  }
}

export const getSelectedTokenInfo = async (
  addres: string,
): Promise<Record<string, string>> => {
  const data = {
    symbol: '',
    decimals: '',
    balance: '',
  }

  const { provider } = storeToRefs(useWeb3ProvidersStore())
  if (!provider.value.selectedAddress) return data

  const erc20 = useErc20(addres)
  await Promise.all([
    erc20.loadDetails(),
    erc20.balanceOf(provider.value.selectedAddress),
  ]).then(res => {
    data.symbol = erc20.symbol.value
    data.decimals = String(erc20.decimals.value)
    data.balance = res[1]

    return
  })

  return data
}
