import { i18n } from '@/localization'
import { ETHEREUM_CHAINS } from '@/enums'

export function localizeChain(chainId: string | number) {
  const { t } = i18n.global
  switch (String(chainId)) {
    case ETHEREUM_CHAINS.mainnet:
      return t('filters.chains.ethereum.mainet')
    case ETHEREUM_CHAINS.rinkeby:
      return t('filters.chains.ethereum.rinkeby')
    case ETHEREUM_CHAINS.ropsten:
      return t('filters.chains.ethereum.ropsten')
    case ETHEREUM_CHAINS.kovan:
      return t('filters.chains.ethereum.kovan')
    case ETHEREUM_CHAINS.goerli:
      return t('filters.chains.ethereum.goerli')
  }
}
