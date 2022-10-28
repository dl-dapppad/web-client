import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'
import { ETHEREUM_CHAINS, CONTRACT_NAMES } from './enums'

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  AVAILABLE_CHAINS: [ETHEREUM_CHAINS.localhost] as string[],
  CONTRACTS: {
    [ETHEREUM_CHAINS.localhost as string]: {
      [CONTRACT_NAMES.DAPP]: import.meta.env.VITE_APP_CONTRACT_LOCAL_DAPP,
      [CONTRACT_NAMES.FARMING]: import.meta.env.VITE_APP_CONTRACT_LOCAL_FARMING,
      [CONTRACT_NAMES.PRODUCT_FACTORY]: import.meta.env
        .VITE_APP_CONTRACT_LOCAL_PRODUCT_FACTORY,
    },
  },
  PRODUCT_ALIASES: {
    erc20: import.meta.env.VITE_APP_CONTRACT_PRODUCT_ERC20_ALIAS,
    erc721: import.meta.env.VITE_APP_CONTRACT_PRODUCT_ERC721_ALIAS,
  } as Record<string, string>,
  MODULES: ['ERC20'],
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
