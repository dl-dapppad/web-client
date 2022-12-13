import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Payment, Payment__factory } from '@/types'

export interface PaymentContract {
  address: Ref<string>
  init: (address: string) => void
  getPaymentTokens: () => Promise<string[]>
  getInputSwapAmount: (address: string, swapAmount: string) => Promise<string>
}

export const usePayment = (contractAddress?: string): PaymentContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Payment | undefined>()
  const _instance_rw = ref<Payment | undefined>()

  const address = ref('')

  const init = (contractAddress: string): void => {
    address.value = contractAddress

    if (provider.value.currentProvider) {
      _instance.value = Payment__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = Payment__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const getPaymentTokens = async (): Promise<string[]> => {
    if (!_instance.value) return []

    return _instance.value.getPaymentTokens()
  }

  const getInputSwapAmount = async (
    address: string,
    swapAmount: string,
  ): Promise<string> => {
    if (!_instance.value) return '0'

    return (
      await _instance.value.getInputSwapAmount(address, swapAmount)
    ).toString()
  }

  if (contractAddress) init(contractAddress)

  return {
    init,

    address,

    getPaymentTokens,
    getInputSwapAmount,
  }
}
