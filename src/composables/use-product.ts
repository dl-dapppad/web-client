import { watch } from 'vue'
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
  useApollo,
} from '@/composables'

import { useProductErc20Base } from '@/modules/erc20/erc20-base/composables/use-product-erc20-base'
import { useProductErc20Mint } from '@/modules/erc20/erc20-mint/composables/use-product-erc20-mint'
import { useProductErc20Burn } from '@/modules/erc20/erc20-burn/composables/use-product-erc20-burn'
import { useProductErc20MintBurn } from '@/modules/erc20/erc20-mint-burn/composables/use-product-erc20-mint-burn'
import { useProductErc20MintBurnCap } from '@/modules/erc20/erc20-mint-burn-cap/composables/use-product-erc20-mint-burn-cap'
import { useProductErc20MintCap } from '@/modules/erc20/erc20-mint-cap/composables/use-product-erc20-mint-cap'
import { useProductErc721Base } from '@/modules/erc721/erc721-base/composables/use-product-erc721-base'
import { useProductErc721Enum } from '@/modules/erc721/erc721-enum/composables/use-product-erc721-enum'
import { useProductErc721Burn } from '@/modules/erc721/erc721-burn/composables/use-product-erc721-burn'
import { useProductErc721BurnEnum } from '@/modules/erc721/erc721-burn-enum/composables/use-product-erc721-burn-enum'

export const useProduct = () => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  const router = useRouter()

  const handleContractSearch = async (address: string) => {
    const apollo = useApollo()
    apollo.getProduct(address)

    watch(apollo.deployedProduct, () => {
      const { t } = i18n.global

      if (!apollo.deployedProduct.value) {
        Bus.warning(t('errors.address-not-found'))
        return
      }

      const filtered = Object.entries(config.PRODUCT_ALIASES).filter(
        ([, value]) => value === apollo.deployedProduct.value?.alias,
      )

      if (!filtered || !filtered.length) {
        Bus.warning(t('errors.address-not-found'))
        return
      }

      router.push({
        name: ROUTE_NAMES.productEdit,
        params: { id: filtered[0][0], contractAddress: address },
      })
    })
  }

  const deploy = async (
    productId: string,
    productPrice: string,
    paymentTokenAddress: string,
    initializeData: unknown[],
  ): Promise<string> => {
    const { t } = i18n.global

    if (!provider.value.selectedAddress) {
      Bus.error(t('errors.provider-unconnected'))
      return ''
    }

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

  const getUseOfErc20Product = (productId: string) => {
    const { t } = i18n.global

    switch (productId) {
      case PRODUCT_IDS.erc20Base:
        return useProductErc20Base()
      case PRODUCT_IDS.erc20Mint:
        return useProductErc20Mint()
      case PRODUCT_IDS.erc20Burn:
        return useProductErc20Burn()
      case PRODUCT_IDS.erc20MintBurn:
        return useProductErc20MintBurn()
      case PRODUCT_IDS.erc20MintBurnCap:
        return useProductErc20MintBurnCap()
      case PRODUCT_IDS.erc20MintCap:
        return useProductErc20MintCap()
      default:
        throw new Error(t('errors.product-not-found'))
    }
  }

  const getUseOfErc721Product = (productId: string) => {
    const { t } = i18n.global

    switch (productId) {
      case PRODUCT_IDS.erc721Base:
        return useProductErc721Base()
      case PRODUCT_IDS.erc721Enum:
        return useProductErc721Enum()
      case PRODUCT_IDS.erc721Burn:
        return useProductErc721Burn()
      case PRODUCT_IDS.erc721BurnEnum:
        return useProductErc721BurnEnum()
      default:
        throw new Error(t('errors.product-not-found'))
    }
  }

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
    try {
      product = getUseOfErc20Product(productId)
      // eslint-disable-next-line no-empty
    } catch {}

    if (!product) {
      try {
        product = getUseOfErc721Product(productId)
        // eslint-disable-next-line no-empty
      } catch {}
    }

    if (!product) {
      throw new Error(t('errors.can-not-create-initialize-data'))
    }

    return product.encodeFunctionData(initializeData)
  }

  return {
    handleContractSearch,
    getProductInfo,
    deploy,
    getAvailablePaymentTokenList,
    getSelectedPaymentTokenInfo,
    makeProductPath,
    getUseOfErc20Product,
    getUseOfErc721Product,
  }
}
