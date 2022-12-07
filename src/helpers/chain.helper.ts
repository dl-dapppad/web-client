import { config } from '@/config'
import { Chain, ChainId } from '@/types'
import chainsData from '@/assets/chains.json'

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

  const chain = chainsData.filter(chain => chain.id === id) as Chain[]

  return chain.length > 0 ? chain[0] : getEmptyChain()
}

export const isChainAvailable = (id: ChainId): boolean => {
  const chainIds = config.AVAILABLE_CHAINS

  return chainIds.includes(String(id))
}
