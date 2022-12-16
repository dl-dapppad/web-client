import { ethers } from 'ethers'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import { i18n } from '@/localization'
import { Bus } from '@/helpers'
import { ROUTE_NAMES, PRODUCT_IDS } from '@/enums'
import { config } from '@/config'
import { getMaxUint256, txWrapper } from '@/helpers'
import { BN } from '@/utils'
import {
  useErc20,
  useProductFactory,
  Erc20Contract,
  useFarming,
  Product,
  usePayment,
} from '@/composables'

import { useProductErc20Base } from '@/modules/erc20/erc20-base/composables/use-product-erc20-base'
import { useProductErc721Base } from '@/modules/erc721/erc721-base/composables/use-product-erc721'

export const useProduct = () => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  const router = useRouter()

  const handleContractSearch = async (address: string) => {
    const productType = await getProductTypeByAddress(address)
    if (!productType) return

    router.push({
      name: ROUTE_NAMES.productEdit,
      params: { id: productType, contractAddress: address },
    })
  }

  const getProductTypeByAddress = async (
    address: string,
  ): Promise<PRODUCT_IDS | undefined> => {
    const { t } = i18n.global

    if (!ethers.utils.isAddress(address)) {
      Bus.warning(t('errors.address-invalid'))
      return
    }

    try {
      const erc20 = useProductErc20Base(address)
      await erc20.updateDecimals()

      return PRODUCT_IDS.erc20Base
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      const erc721 = useProductErc721Base(address)
      await erc721.updateBaseURI()

      return PRODUCT_IDS.erc721Base
      // eslint-disable-next-line no-empty
    } catch {}

    Bus.warning(t('errors.address-not-found'))
  }

  const deploy = async (
    productId: string,
    productPrice: string,
    paymentTokenAddress: string,
    initializeData: unknown[],
  ): Promise<string> => {
    if (!provider.value.selectedAddress) return ''

    const alias = config.PRODUCT_ALIASES[productId as string]

    const factory = useProductFactory()
    const paymentContract = await factory.payment()

    const paymentToken = useErc20(paymentTokenAddress)
    const isApproved = await _isApproved(
      paymentToken,
      provider.value.selectedAddress as string,
      paymentContract,
      productPrice,
    )
    if (!isApproved) return ''

    const encodedInitializeData = _getInitializeData(productId, initializeData)
    const potentialContractAddress = await factory.getPotentialContractAddress(
      alias,
      encodedInitializeData,
      provider.value.selectedAddress,
    )

    const txSucces = await txWrapper(factory.deploy, {
      alias,
      paymentTokenAddress,
      encodedInitializeData,
    })

    if (!txSucces) return ''

    await useAccountStore().updateDappBalance()

    return potentialContractAddress
  }

  const getProductInfo = async (alias: string): Promise<Product> => {
    const factory = useProductFactory()

    return factory.products(alias)
  }

  const getAvailablePaymentTokenList = async (): Promise<
    Record<string, Array<string>>
  > => {
    const farming = useFarming()
    const factory = useProductFactory()

    let paymentContractAddress = ''
    const [address] = await Promise.all([
      factory.payment(),
      farming.loadDetails(),
    ])
    paymentContractAddress = address

    const payment = usePayment(paymentContractAddress)
    const paymentTokensAddresses = await payment.getPaymentTokens()
    const tokensAddresses = [
      farming.rewardToken.value,
      ...paymentTokensAddresses,
    ]

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

  const getSelectedPaymentTokenInfo = async (
    address: string,
    isSwapToken = false,
    swapAmount = '0',
  ): Promise<Record<string, string>> => {
    const data = {
      symbol: '',
      decimals: '',
      balance: '',
      amount: '0',
    }

    const { provider } = storeToRefs(useWeb3ProvidersStore())
    if (!provider.value.selectedAddress) return data

    const erc20 = useErc20(address)
    const [balance] = await Promise.all([
      erc20.balanceOf(provider.value.selectedAddress),
      erc20.loadDetails(),
    ])

    data.symbol = erc20.symbol.value
    data.decimals = String(erc20.decimals.value)
    data.balance = balance

    if (!isSwapToken) return data

    const factory = useProductFactory()
    const paymentContractAddress = await factory.payment()
    const payment = usePayment(paymentContractAddress)
    data.amount = await payment.getInputSwapAmount(address, swapAmount)

    return data
  }

  const makeProductPath = (product: string) =>
    /-/.test(product) ? [product.split('-')[0], product] : [product]

  const _isApproved = async (
    paymentToken: Erc20Contract,
    address: string,
    paymentContract: string,
    productPrice: string,
  ): Promise<boolean> => {
    const allowance = await paymentToken.allowance(address, paymentContract)
    if (new BN(allowance).compare(productPrice) >= 0) return true

    return txWrapper(paymentToken.approve, {
      spender: paymentContract,
      amount: getMaxUint256(),
    })
  }

  const _getInitializeData = (
    productId: string,
    initializeData: unknown[],
  ): string => {
    const { t } = i18n.global

    let product
    switch (productId) {
      case PRODUCT_IDS.erc20Base:
        product = useProductErc20Base()
        break
      case PRODUCT_IDS.erc721Base:
        product = useProductErc721Base()
        break
      default:
        throw new Error(t('errors.can-not-create-initialize-data'))
    }

    return product.encodeFunctionData(initializeData)
  }

  return {
    handleContractSearch,
    getProductInfo,
    getProductTypeByAddress,
    deploy,
    getAvailablePaymentTokenList,
    getSelectedPaymentTokenInfo,
    makeProductPath,
  }
}
