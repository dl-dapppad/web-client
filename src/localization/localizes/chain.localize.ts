import { i18n } from '@/localization'
import { ETHEREUM_CHAINS } from '@/enums'

export function localizeChain(chainId: string | number) {
  const { t } = i18n.global
  switch (String(chainId)) {
    case ETHEREUM_CHAINS.goerli:
      return t('filters.chains.ethereum.goerli')
    case ETHEREUM_CHAINS.polygon:
      return t('filters.chains.ethereum.polygon')
    case ETHEREUM_CHAINS.mumbai:
      return t('filters.chains.ethereum.mumbai')
    case ETHEREUM_CHAINS.localhost:
      return t('filters.chains.ethereum.localhost')
  }
}
