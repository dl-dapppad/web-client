import { Ref } from 'vue'

interface CommonContract {
  init: (contractAddress: string) => void
  loadDetails: () => Promise<void>
  getAddress: () => string
}

// DAPP contract
export interface Erc20Contract extends CommonContract {
  name: Ref<string>
  symbol: Ref<string>
  decimals: Ref<number>
  updateName: () => Promise<void>
  updateSymbol: () => Promise<void>
  updateDecimals: () => Promise<void>
  balanceOf: (address: string) => Promise<string>
}

// ProductFactory contract
export interface Product {
  cashbackPercent: string
  decreasePercent: string
  currentPrice: string
  minPrice: string
  implementation: string
  salesCount: string
  isActive: boolean
}

export interface ProductFactoryContract extends CommonContract {
  getEmptyProduct: () => Product
  products: (alias: string) => Promise<Product>
  getCashback: (alias: string) => Promise<string>
}

// Farming contract
export interface FarmingContract extends CommonContract {
  investmentToken: Ref<string>
  rewardToken: Ref<string>
  updateInvestmentToken: () => Promise<void>
  updateRewardToken: () => Promise<void>
}
