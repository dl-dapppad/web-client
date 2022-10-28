import { ChainId } from '@/types'

export const getAlias = (chainId: ChainId, productId: string): string => {
  chainId = String(chainId)

  if (chainId === '1337') {
    switch (productId) {
      case 'erc20':
        return '0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b'
      case 'erc721':
        return '0x73ad2146b3d3a286642c794379d750360a2d53a3459a11b3e5d6cc900f55f44a'
    }
  }

  return ''
}
