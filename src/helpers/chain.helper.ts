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

export const getChain = (id: ChainId): Chain => {
  id = String(id)

  switch (id) {
    case '1':
      return {
        id,
        name: 'Ethereum',
        explorerUrl: 'https://etherscan.io/',
        rpcUrl: '',
        symbol: 'ETH',
        decimals: 18,
      }
    case '5':
      return {
        id,
        name: 'Goerli',
        explorerUrl: 'https://goerli.etherscan.io/',
        rpcUrl: '',
        symbol: 'GoerliETH',
        decimals: 18,
      }
    case '1337':
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
