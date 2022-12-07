import { defineStore } from 'pinia'
import { useProvider, useWeb3 } from '@/composables'
import { DesignatedProvider } from '@/types'
import { PROVIDERS } from '@/enums'
import { i18n } from '@/localization'
import { isChainAvailable } from '@/helpers'
import { config } from '@/config'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as DesignatedProvider[],
    provider: useProvider(),
  }),
  actions: {
    async detectProviders() {
      const web3 = useWeb3()
      await web3.init()
      this.providers = web3.providers.value
    },
    async connect() {
      const { t } = i18n.global

      if (this.provider.selectedAddress) {
        const infuraProvider = this.providers.find(
          provider => provider.name === PROVIDERS.rpc,
        )

        if (infuraProvider) await this.provider.init(infuraProvider)
      } else {
        const metamaskProvider = this.providers.find(
          provider => provider.name === PROVIDERS.metamask,
        )

        if (metamaskProvider) await this.provider.init(metamaskProvider)
        else throw new Error(t('errors.provider-unconnected'))

        try {
          await this.provider.connect()
        } catch {
          throw new Error(t('errors.provider-user-rejected-request'))
        }

        const chainId = this.provider.chainId
        if (!chainId || !isChainAvailable(chainId)) {
          try {
            await this.provider.switchChain(config.AVAILABLE_CHAINS[0])
          } catch (error) {
            throw new Error(t('errors.provider-chain-invalid'))
          }
        }
      }
    },
    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },
  },
})
