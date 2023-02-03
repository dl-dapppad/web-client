import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { Cashback, Cashback__factory } from '@/types'

export type ProductsCahsback = {
  cumulativeSum: string
  totalPoints: string
}

export interface CashbackContract {
  address: Ref<string>
  init: (address: string) => void
  getProductCahsback: (alias: string) => Promise<ProductsCahsback>
  getAccountCashback: (alias: string, account: string) => Promise<string>
}

export const useCashback = (contractAddress?: string): CashbackContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Cashback | undefined>()
  const _instance_rw = ref<Cashback | undefined>()

  const address = ref('')

  const init = (contractAddress: string): void => {
    if (!provider.value.chainId) return

    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = Cashback__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = Cashback__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const getProductCahsback = async (
    alias: string,
  ): Promise<ProductsCahsback> => {
    if (!_instance.value) {
      return {
        cumulativeSum: '0',
        totalPoints: '0',
      }
    }

    const res = await _instance.value.productsCahsback(alias)

    return {
      cumulativeSum: res[0].toString(),
      totalPoints: res[1].toString(),
    }
  }

  const getAccountCashback = async (
    alias: string,
    account: string,
  ): Promise<string> => {
    if (!_instance.value) return ''

    return (await _instance.value.getAccountCashback(alias, account)).toString()
  }

  if (contractAddress) init(contractAddress)

  return {
    init,

    address,

    getProductCahsback,
    getAccountCashback,
  }
}
