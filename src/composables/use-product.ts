import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  useWeb3ProvidersStore,
  useAccountStore,
  useContractsStore,
} from '@/store'
import { i18n } from '@/localization'
import { Bus } from '@/helpers'
import { ROUTE_NAMES, PRODUCT_IDS } from '@/enums'
import { config } from '@/config'
import { getMaxUint256, txWrapper } from '@/helpers'
import { BN } from '@/utils'
import { useErc20, Erc20Contract } from '@/composables'

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

import {
  GetProduct,
  GetProductQuery,
  GetPaymentTokens,
  GetPaymentTokensQuery,
} from '@/types/graphql'
import { coreApolloClient } from '@/api/graphql/core.graphql'

export const useProduct = () => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  const contracts = useContractsStore()

  const router = useRouter()
  const alias = ref('')

  const handleContractSearch = async (address: string) => {
    watch(
      () => alias.value,
      () => {
        const { t } = i18n.global

        if (!alias.value) {
          Bus.warning(t('errors.address-not-found'))
          return
        }

        const filtered = Object.entries(config.PRODUCT_ALIASES).filter(
          ([, value]) => value === (alias.value.slice(0, -8) as string),
        )

        if (!filtered || !filtered.length) {
          Bus.warning(t('errors.address-not-found'))
          return
        }

        router.push({
          name: ROUTE_NAMES.productEdit,
          params: { id: filtered[0][0], contractAddress: address },
        })
      },
    )

    alias.value = (
      await coreApolloClient.query<GetProductQuery>({
        query: GetProduct,
        fetchPolicy: 'network-only',
        variables: {
          productProxyAddress: address,
        },
      })
    ).data.productSales[0].alias
  }

  const deploy = async (
    productId: string,
    productPrice: string,
    paymentTokenAddress: string,
    initializeData: unknown[],
    discountAliases: string[],
    discountValues: string[],
  ): Promise<string> => {
    const { t } = i18n.global

    if (!provider.value.selectedAddress) {
      Bus.error(t('errors.provider-unconnected'))
      return ''
    }

    if (!contracts.loaded) await contracts.load()

    const alias = config.PRODUCT_ALIASES[productId as string]

    const isApproved = await _isApproved(
      useErc20(paymentTokenAddress),
      provider.value.selectedAddress as string,
      contracts.payment.address,
      productPrice,
    )
    if (!isApproved) return ''

    const encodedInitializeData = _getInitializeData(productId, initializeData)
    const potentialContractAddress =
      await contracts.factory.getPotentialContractAddress(
        alias,
        encodedInitializeData,
        provider.value.selectedAddress,
      )

    const txSucces = await txWrapper(contracts.factory.deploy, {
      alias,
      paymentTokenAddress,
      encodedInitializeData,
      discountAliases,
      discountValues,
    })

    if (!txSucces) return ''

    await useAccountStore().updateCashbackInfo()

    return potentialContractAddress
  }

  const getAvailablePaymentTokenList = async (): Promise<
    Record<string, Array<string>>
  > => {
    const paymentTokensAddresses = (
      await coreApolloClient.query<GetPaymentTokensQuery>({
        query: GetPaymentTokens,
        fetchPolicy: 'network-only',
      })
    ).data.paymentTokens.map(apolloPaymentToken => apolloPaymentToken.token)

    const requests: Promise<void>[] = []
    const paymentTokens = paymentTokensAddresses.map(address =>
      useErc20(address),
    )
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
  ): Promise<Record<string, string>> => {
    const data = {
      symbol: '',
      decimals: '',
      balance: '',
    }

    const erc20 = useErc20(address)
    await erc20.loadDetails()

    data.symbol = erc20.symbol.value
    data.decimals = String(erc20.decimals.value)

    if (provider.value.selectedAddress) {
      const balance = await erc20.balanceOf(
        provider.value?.selectedAddress as string,
      )

      data.balance = balance
    }

    return data
  }

  const getProductIdByAlias = (alias: string): PRODUCT_IDS => {
    return Object.keys(config.PRODUCT_ALIASES).find(
      key => config.PRODUCT_ALIASES[key] === alias,
    ) as PRODUCT_IDS
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
    deploy,
    getAvailablePaymentTokenList,
    getSelectedPaymentTokenInfo,
    getProductIdByAlias,
    makeProductPath,
    getUseOfErc20Product,
    getUseOfErc721Product,
  }
}
