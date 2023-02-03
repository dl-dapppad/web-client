import { defineStore } from 'pinia'
import { useAccount } from '@/composables'

export const useAccountStore = defineStore('account-store', {
  state: () => ({
    account: useAccount(),
  }),
  actions: {
    async updateNativeBalance() {
      this.account.updateNativeBalance()
    },
    async updateCashbackInfo() {
      this.account.updateCashbackInfo()
    },
  },
})
