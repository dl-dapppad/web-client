import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Payment, Payment__factory } from '@/types'

export interface PaymentContract {
  address: Ref<string>
  init: (address: string) => void
  pointToken: () => Promise<string>
  cashback: () => Promise<string>
  getPaymentToken: (index: number) => Promise<string>
  getPriceWithDiscount: (
    paymentToken: string,
    price: string,
    cashback: string,
    discount: string,
  ) => Promise<string>
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

  const pointToken = async (): Promise<string> => {
    if (!_instance.value) return ''

    return _instance.value.pointToken()
  }

  const cashback = async (): Promise<string> => {
    if (!_instance.value) return ''

    return _instance.value.cashback()
  }

  const getPaymentToken = async (index: number): Promise<string> => {
    if (!_instance.value) return ''

    return _instance.value.getPaymentToken(index)
  }

  const getPriceWithDiscount = async (
    paymentToken: string,
    price: string,
    cashback: string,
    discount: string,
  ): Promise<string> => {
    if (!_instance.value) return ''

    const res = await _instance.value.getPriceWithDiscount(
      paymentToken,
      price,
      cashback,
      discount,
    )

    return res[0].toString()
  }

  // const getInputSwapAmount = async (
  //   address: string,
  //   swapAmount: string,
  // ): Promise<string> => {
  //   if (!_instance.value) return '0'

  //   return (
  //     await _instance.value.getInputSwapAmount(address, swapAmount)
  //   ).toString()
  // }

  if (contractAddress) init(contractAddress)

  return {
    init,

    address,

    pointToken,
    cashback,
    getPaymentToken,
    getPriceWithDiscount,
  }
}
