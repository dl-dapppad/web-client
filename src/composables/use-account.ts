import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useContractsStore } from '@/store'
import { ref, watch } from 'vue'
import { BN } from '@/utils'

import { GetAccountPools, GetAccountPoolsQuery } from '@/types/graphql'
import { coreApolloClient } from '@/api/graphql/core.graphql'

export type AccountCashbackPool = {
  alias: string
  cashback: string
  totalPoints: string
}

export const useAccount = () => {
  const contracts = useContractsStore()
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const nativeBalance = ref('0')
  const accountCashbackPools = ref<AccountCashbackPool[]>([])
  const accountCashback = ref('0')
  const isLoaded = ref(false)

  const init = async () => {
    isLoaded.value = false
    await Promise.all([updateCashbackInfo(), updateNativeBalance()])
  }

  const updateCashbackInfo = async () => {
    if (!provider.value.selectedAddress || !contracts.loaded) return

    accountCashbackPools.value = []
    const apolloRes = (
      await coreApolloClient.query<GetAccountPoolsQuery>({
        query: GetAccountPools,
        fetchPolicy: 'network-only',
        variables: {
          user: provider.value.selectedAddress,
        },
      })
    ).data.userToProducts

    const account = provider.value.selectedAddress

    const requests: Promise<string>[] = []
    apolloRes.forEach(accountPool => {
      requests.push(
        contracts.cashback.getAccountCashback(accountPool.product, account),
      )
    })

    const pools: AccountCashbackPool[] = []
    await Promise.all(requests).then(res => {
      res.forEach((cashback, i) => {
        pools.push({
          alias: apolloRes[i].product,
          cashback,
          totalPoints: apolloRes[i].totalPoints,
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

    isLoaded.value = true
  }

  const updateNativeBalance = async () => {
    if (!provider.value.selectedAddress) return

    const balance = await provider.value.currentProvider?.getBalance(
      provider.value.selectedAddress,
    )

    if (!balance) return
    nativeBalance.value = balance.toString()
  }

  watch(
    () => [
      provider.value.selectedAddress,
      provider.value.chainId,
      contracts.loaded,
    ],
    init,
  )

  init()

  return {
    nativeBalance,
    accountCashbackPools,
    accountCashback,
    isLoaded,

    updateNativeBalance,
    updateCashbackInfo,
  }
}
