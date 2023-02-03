import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import {
  useErc20,
  usePayment,
  useProductFactory,
  useCashback,
  ProductFactoryContract,
  PaymentContract,
  CashbackContract,
  Erc20Contract,
} from '@/composables'

export interface SystemContracts {
  factory: ProductFactoryContract
  payment: PaymentContract
  cashback: CashbackContract
  pointToken: Erc20Contract

  loadDetails: () => Promise<void>
}

export const useSystemContracts = (): SystemContracts => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _loaded = ref(false)

  const factory = useProductFactory()
  const payment = usePayment()
  const cashback = useCashback()
  const pointToken = useErc20()

  const loadDetails = async (): Promise<void> => {
    if (!provider.value.chainId || _loaded.value) return

    const paymentAddress = await factory.payment()
    payment.init(paymentAddress)

    const [pointTokenAddress, cashbackAddress] = await Promise.all([
      payment.pointToken(),
      payment.cashback(),
    ])

    cashback.init(cashbackAddress)

    pointToken.init(pointTokenAddress)
    await pointToken.loadDetails()

    _loaded.value = true
  }

  return {
    factory,
    payment,
    cashback,
    pointToken,

    loadDetails,
  }
}
