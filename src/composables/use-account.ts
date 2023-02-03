import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { ref, watch } from 'vue'
import { BN } from '@/utils'
import { useApollo, useSystemContracts } from '@/composables'

export type AccountCashbackPool = {
  alias: string
  cashback: string
  totalPoints: string
}

export const useAccount = () => {
  const web3Store = useWeb3ProvidersStore()
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const apollo = useApollo()
  const systemContracts = useSystemContracts()

  const nativeBalance = ref('0')
  const accountCashbackPools = ref<AccountCashbackPool[]>([])
  const accountCashback = ref('0')

  const init = async () => {
    updateCashbackInfo()
    updateNativeBalance()
  }

  const updateCashbackInfo = () => {
    if (!provider.value.selectedAddress) return

    apollo.getAccountPools(provider.value.selectedAddress)

    watch(apollo.accountPools, async () => {
      if (!provider.value.selectedAddress) return
      const account = provider.value.selectedAddress

      await systemContracts.loadDetails()

      const requests: Promise<string>[] = []
      apollo.accountPools.value.forEach(accountPool => {
        requests.push(
          systemContracts.cashback.getAccountCashback(
            accountPool.product,
            account,
          ),
        )
      })

      const pools: AccountCashbackPool[] = []
      await Promise.all(requests).then(res => {
        res.forEach((cashback, i) => {
          pools.push({
            alias: apollo.accountPools.value[i].product,
            cashback,
            totalPoints: apollo.accountPools.value[i].totalPoints,
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
    })
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
    () => [provider.value.selectedAddress, provider.value.chainId],
    () => {
      if (web3Store.isCurrentChainAvailable) {
        init()
      }
    },
  )

  init()

  return {
    nativeBalance,
    accountCashbackPools,
    accountCashback,

    updateNativeBalance,
    updateCashbackInfo,
  }
}
