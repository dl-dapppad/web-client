import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import { errors } from '@/errors'
import { ProductFactory, ProductFactory__factory } from '@/types'
import { CONTRACT_NAMES } from '@/enums'
import { config } from '@/config'

export interface Product {
  cashbackPercent: string
  decreasePercent: string
  currentPrice: string
  minPrice: string
  implementation: string
  salesCount: string
  isActive: boolean
}

export interface ProductFactoryContract {
  address: Ref<string>
  init: (contractAddress: string) => void
  getEmptyProduct: () => Product
  payment: () => Promise<string>
  products: (alias: string) => Promise<Product>
  getCashback: (alias: string) => Promise<string>
  getPotentialContractAddress: (
    alias: string,
    initializeData: string,
    from: string,
  ) => Promise<string>
  deploy: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useProductFactory = (): ProductFactoryContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<ProductFactory | undefined>()
  const _instance_rw = ref<ProductFactory | undefined>()

  const address = ref('')

  const init = (): void => {
    if (!provider.value.chainId) return

    address.value =
      config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.PRODUCT_FACTORY]

    if (provider.value.currentProvider) {
      _instance.value = ProductFactory__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = ProductFactory__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const getEmptyProduct = (): Product => {
    return {
      cashbackPercent: '0',
      decreasePercent: '0',
      currentPrice: '0',
      minPrice: '0',
      implementation: '',
      salesCount: '0',
      isActive: false,
    }
  }

  const payment = async (): Promise<string> => {
    if (!_instance.value) return '0'

    return _instance.value.payment()
  }

  const products = async (alias: string): Promise<Product> => {
    const product = getEmptyProduct()
    if (!_instance.value) return product

    const res = await _instance.value.products(alias)

    product.cashbackPercent = res.cashbackPercent.toString()
    product.decreasePercent = res.decreasePercent.toString()
    product.currentPrice = res.currentPrice.toString()
    product.minPrice = res.minPrice.toString()
    product.implementation = res.implementation.toString()
    product.salesCount = res.salesCount.toString()
    product.isActive = res.isActive

    return product
  }

  const getCashback = async (alias: string): Promise<string> => {
    if (!_instance.value) return '0'

    return (await _instance.value.getCashback(alias)).toString()
  }

  const getPotentialContractAddress = async (
    alias: string,
    initializeData: string,
    from: string,
  ): Promise<string> => {
    if (!_instance.value) return '0'

    return _instance.value.getPotentialContractAddress(alias, initializeData, {
      from,
    })
  }

  const deploy = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    const tx = await _instance_rw.value.deploy(
      args.alias,
      args.paymentTokenAddress,
      args.encodedInitializeData,
    )

    return tx
  }

  init()

  return {
    init,

    address,

    getEmptyProduct,
    payment,
    products,
    getCashback,
    getPotentialContractAddress,
    deploy,
  }
}
