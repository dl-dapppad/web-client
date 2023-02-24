import { defineStore } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import {
  useErc20,
  usePayment,
  useProductFactory,
  useCashback,
} from '@/composables'

export const useContractsStore = defineStore('contracts-store', {
  state: () => ({
    factory: useProductFactory(),
    payment: usePayment(),
    cashback: useCashback(),
    pointToken: useErc20(),
    loading: false,
    loaded: false,
  }),
  actions: {
    async load() {
      const providerStore = useWeb3ProvidersStore()
      if (
        !providerStore.provider.chainId ||
        !providerStore.isCurrentChainAvailable ||
        this.loading
      ) {
        return
      }

      this.loading = true

      this.factory.init()

      const paymentAddress = await this.factory.payment()
      this.payment.init(paymentAddress)

      const [pointTokenAddress, cashbackAddress] = await Promise.all([
        this.payment.pointToken(),
        this.payment.cashback(),
      ])

      this.cashback.init(cashbackAddress)

      this.pointToken.init(pointTokenAddress)
      await this.pointToken.loadDetails()

      this.loading = false
      this.loaded = true
    },
  },
})
