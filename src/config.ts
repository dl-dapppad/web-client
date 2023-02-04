import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'
import { ETHEREUM_CHAINS, CONTRACT_NAMES, PRODUCT_IDS } from './enums'

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  AVAILABLE_CHAINS: [ETHEREUM_CHAINS.mumbai] as string[],
  URL_SUBGRAPH: import.meta.env.VITE_APP_URL_SUBGRAPH,
  RPC_URL: {
    [ETHEREUM_CHAINS.mumbai as string]: import.meta.env.VITE_APP_RPC_URL_MUMBAI,
  },
  GAS_PRICE_URL: {
    [ETHEREUM_CHAINS.mumbai as string]: import.meta.env
      .VITE_APP_MUMBAI_GAS_PRICE_URL,
  },
  CONTRACTS: {
    [ETHEREUM_CHAINS.mumbai as string]: {
      [CONTRACT_NAMES.PRODUCT_FACTORY]: import.meta.env
        .VITE_APP_CONTRACT_MUMBAI_PRODUCT_FACTORY,
    },
  },
  PRODUCT_ALIASES: {
    [PRODUCT_IDS.erc20Base]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_ALIAS,
    [PRODUCT_IDS.erc20Mint]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_ALIAS,
    [PRODUCT_IDS.erc20Burn]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_BURN_ALIAS,
    [PRODUCT_IDS.erc20MintBurn]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_BURN_ALIAS,
    [PRODUCT_IDS.erc20MintBurnCap]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_BURN_CAP_ALIAS,
    [PRODUCT_IDS.erc20MintCap]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC20_MINT_CAP_ALIAS,
    [PRODUCT_IDS.erc721Base]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC721_ALIAS,
    [PRODUCT_IDS.erc721Enum]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC721_ENUM_ALIAS,
    [PRODUCT_IDS.erc721Burn]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC721_BURN_ALIAS,
    [PRODUCT_IDS.erc721BurnEnum]: import.meta.env
      .VITE_APP_CONTRACT_PRODUCT_ERC721_BURN_ENUM_ALIAS,
  } as Record<string, string>,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
