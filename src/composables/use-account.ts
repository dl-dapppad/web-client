import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useContractsStore } from '@/store'
import { ref, watch } from 'vue'
import { BN } from '@/utils'
import { useApollo } from '@/composables'

export type AccountCashbackPool = {
  alias: string
  cashback: string
  totalPoints: string
}

export const useAccount = () => {
  const contracts = useContractsStore()
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const apollo = useApollo()

  const nativeBalance = ref('0')
  const accountCashbackPools = ref<AccountCashbackPool[]>([])
  const accountCashback = ref('0')

  const init = async () => {
    updateCashbackInfo()
    updateNativeBalance()
  }

  const updateCashbackInfo = async () => {
    if (!provider.value.selectedAddress || !contracts.loaded) return

    accountCashbackPools.value = []
    const apooloRes = await apollo.getAccountPools(
      provider.value.selectedAddress,
    )

    const account = provider.value.selectedAddress

    const requests: Promise<string>[] = []
    apooloRes.forEach(accountPool => {
      requests.push(
        contracts.cashback.getAccountCashback(accountPool.product, account),
      )
    })

    const pools: AccountCashbackPool[] = []
    await Promise.all(requests).then(res => {
      res.forEach((cashback, i) => {
        pools.push({
          alias: apooloRes[i].product,
          cashback,
          totalPoints: apooloRes[i].totalPoints,
        })
      })

      return
    })

    accountCashbackPools.value = pools
    accountCashback.value = pools
      .reduce(
        (totalCashback, pool) => new BN(totalCashback).add(pool.cashback),
        new BN(0),
      )
      .toString()
  }

  const updateNativeBalance = async () => {
    if (!provider.value.selectedAddress) return

    const balance = await provider.value.currentProvider?.getBalance(
      provider.value.selectedAddress,
    )

    if (!balance) return
    nativeBalance.value = balance.toString()
  }

  watch(() => [provider.value.selectedAddress, contracts.loaded], init)

  init()

  return {
    nativeBalance,
    accountCashbackPools,
    accountCashback,

    updateNativeBalance,
    updateCashbackInfo,
  }
}
