import { ref } from 'vue'
import { ethers } from 'ethers'
import { config } from '@config'
import { Product, ProductFactoryContract } from '@/types'
import { ProdyctFactory, ProdyctFactory__factory } from '@/types'

export const useProductFactory = (
  currentProvider?: ethers.providers.Web3Provider,
  currentSigner?: ethers.providers.JsonRpcSigner,
  address?: string,
): ProductFactoryContract => {
  const _instance = ref<ProdyctFactory | undefined>()
  const _instance_rw = ref<ProdyctFactory | undefined>()

  const init = (contractAddress: string): void => {
    address = contractAddress

    if (currentProvider) {
      _instance.value = ProdyctFactory__factory.connect(
        contractAddress,
        currentProvider,
      )
    }
    if (currentSigner) {
      _instance_rw.value = ProdyctFactory__factory.connect(
        contractAddress,
        currentSigner,
      )
    }
  }

  if (!address) init(config.CONTRACT_PRODUCT_FACTORY)
  else init(address ?? '')

  const loadDetails = async (): Promise<void> => {
    return
  }

  const getAddress = (): string => {
    return address ?? ''
  }

  const getEmptyProduct = (): Product => {
    return {
      cashbackPercent: '',
      decreasePercent: '',
      currentPrice: '',
      minPrice: '',
      implementation: '',
      salesCount: '',
      isActive: false,
    }
  }

  const products = async (alias: string): Promise<Product> => {
    const product = {
      cashbackPercent: '',
      decreasePercent: '',
      currentPrice: '',
      minPrice: '',
      implementation: '',
      salesCount: '',
      isActive: false,
    }

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

  return {
    init,
    loadDetails,
    getAddress,

    getEmptyProduct,
    products,
    getCashback,
  }
}
