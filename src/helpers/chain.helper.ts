import { config } from '@/config'
import { ETHEREUM_CHAINS } from '@/enums'
import { Chain, ChainId } from '@/types'

export const getEmptyChain = (): Chain => {
  return {
    id: '',
    name: '',
    explorerUrl: '',
    rpcUrl: '',
    symbol: '',
    decimals: 0,
  }
}

export const getChain = (id?: ChainId): Chain => {
  id = String(id)

  switch (id) {
    case ETHEREUM_CHAINS.mainnet:
      return {
        id,
        name: 'Ethereum',
        explorerUrl: 'https://etherscan.io/',
        rpcUrl: '',
        symbol: 'ETH',
        decimals: 18,
      }
    case ETHEREUM_CHAINS.goerli:
      return {
        id,
        name: 'Goerli',
        explorerUrl: 'https://goerli.etherscan.io/',
        rpcUrl: '',
        symbol: 'GoerliETH',
        decimals: 18,
      }
    case ETHEREUM_CHAINS.localhost:
      return {
        id,
        name: 'Local Network',
        explorerUrl: '',
        rpcUrl: '',
        symbol: 'LocalETH',
        decimals: 18,
      }
    default: {
      return getEmptyChain()
    }
  }
}

export const isChainAvailable = (id: ChainId): boolean => {
  const chainIds = config.AVAILABLE_CHAINS

  return chainIds.includes(id as string)
}
