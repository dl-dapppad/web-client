import { defineStore } from 'pinia'
import { useProvider, useWeb3 } from '@/composables'
import { DesignatedProvider, Chain } from '@/types'
import { PROVIDERS } from '@/enums'
import { i18n } from '@/localization'
import { config } from '@/config'
import { api } from '@/api'
import chainsData from '@/assets/chains.json'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as DesignatedProvider[],
    provider: useProvider(),
    gasPrice: {
      requested: false,
      value: '0',
    },
  }),
  getters: {
    currentChain: state => {
      return (
        chainsData.filter(
          chain => chain.id === String(state.provider.chainId),
        ) as Chain[]
      )[0]
    },
    isCurrentChainAvailable: state => {
      return config.AVAILABLE_CHAINS.includes(String(state.provider.chainId))
    },
  },
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

        if (!this.isCurrentChainAvailable) {
          try {
            await this.addMumbaiTestnet()
          } catch (err) {
            throw err as Error
          }
        }
      }
    },
    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },
    async addMumbaiTestnet() {
      const { t } = i18n.global

      if (window.ethereum?.request) {
        await window.ethereum
          ?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          })
          .catch(() => {
            throw new Error(t('errors.provider-user-rejected-request'))
          })
      } else {
        throw new Error(t('errors.provider-chain-invalid'))
      }
    },
    async detectGasPrice() {
      if (!this.provider.chainId || this.gasPrice.requested) return

      this.gasPrice.requested = true

      const url = config.GAS_PRICE_URL[this.provider.chainId]
      this.gasPrice.value = (await api.get(url)).data.estimatedBaseFee
    },
  },
})
