/* eslint-disable @typescript-eslint/no-explicit-any */

import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import {
  useErc20,
  useProductFactory,
  Erc20Contract,
  useFarming,
  Product,
  usePayment,
} from '@/composables'
import { getMaxUint256, txWrapper } from '@/helpers'
import { BN } from '@/utils'
import { Interface } from 'ethers/lib/utils'
import { config } from '@/config'

import erc20Abi from '@/modules/erc20/erc20-base/abi/ERC20.json'
import erc721Abi from '@/modules/erc721/erc721-base/abi/ERC721.json'
import { PRODUCT_IDS } from '@/enums'

export const deploy = async (
  productId: string,
  paymentTokenAddress: string,
  initializeDataValues: any[],
): Promise<string> => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  if (!provider.value.chainId || !provider.value.selectedAddress) return ''

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
  const factory = useProductFactory()

  let paymentContractAddress = ''
  await Promise.all([farming.loadDetails(), factory.payment()]).then(res => {
    paymentContractAddress = res[1]
    return
  })

  const payment = usePayment(paymentContractAddress)
  const paymentTokensAddresses = await payment.getPaymentTokens()
  const tokensAddresses = [farming.rewardToken.value, ...paymentTokensAddresses]

  const requests: Promise<void>[] = []
  const paymentTokens = tokensAddresses.map(address => useErc20(address))
  paymentTokens.forEach(token => requests.push(token.loadDetails()))

  await Promise.all(requests)

  const symbols: string[] = []
  const addresses: string[] = []
  paymentTokens.forEach(token => {
    symbols.push(token.symbol.value)
    addresses.push(token.address.value)
  })

  return { symbols: symbols, addresses: addresses }
}

export const getSelectedTokenInfo = async (
  address: string,
  isSwapToken = false,
  swapAmount = '0',
): Promise<Record<string, string>> => {
  const data = {
    symbol: '',
    decimals: '',
    balance: '',
    swapPrice: '0',
  }

  const { provider } = storeToRefs(useWeb3ProvidersStore())
  if (!provider.value.selectedAddress) return data

  const erc20 = useErc20(address)
  await Promise.all([
    erc20.loadDetails(),
    erc20.balanceOf(provider.value.selectedAddress),
  ]).then(res => {
    data.symbol = erc20.symbol.value
    data.decimals = String(erc20.decimals.value)
    data.balance = res[1]

    return
  })

  if (!isSwapToken) return data

  const factory = useProductFactory()
  const paymentContractAddress = await factory.payment()
  const payment = usePayment(paymentContractAddress)
  data.swapPrice = await payment.getInputSwapAmount(address, swapAmount)

  return data
}

export const makeProductPath = (product: string, form: 'deploy' | 'edit') => {
  const path = /-/.test(product)
    ? `${product.split('-')[0]}/${product}`
    : product

  const comps =
    form === 'deploy'
      ? import.meta.glob('@/modules/**/forms/DeployForm.vue')
      : import.meta.glob('@/modules/**/forms/EditForm.vue')

  let importPath = ''
  for (const comp in comps) {
    if (comp.includes(path)) importPath = comp
  }

  return importPath
}
