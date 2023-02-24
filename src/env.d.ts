/// <reference types="vite/client" />

import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { WritableComputedRef } from 'vue'
import { EthereumProvider } from '@/types'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routes: typeof ROUTE_NAMES
    $icons: typeof ICON_NAMES
    $config: typeof config
    $locale: WritableComputedRef
  }
}

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string
  VITE_APP_URL_SUBGRAPH_MUMBAI: string
  VITE_APP_URL_SUBGRAPH_POLYGON: string
  VITE_APP_RPC_URL_MUMBAI: string
  VITE_APP_RPC_URL_POLYGON: string
  VITE_APP_MUMBAI_GAS_PRICE_URL: string
  VITE_APP_POLYGON_GAS_PRICE_URL: string
  VITE_APP_CONTRACT_MUMBAI_PRODUCT_FACTORY: string
  VITE_APP_CONTRACT_POLYGON_PRODUCT_FACTORY: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_BURN_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_BURN_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_BURN_CAP_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_CAP_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC721_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC721_ENUM_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC721_BURN_ALIAS: string
  VITE_APP_CONTRACT_PRODUCT_ERC721_BURN_ENUM_ALIAS: string
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }

  interface Window {
    ethereum?: EthereumProvider
    solflare?: {
      isSolflare: boolean
    }
    solana?: unknown
  }
}
