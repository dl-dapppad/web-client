import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Farming, Farming__factory } from '@/types'
import { CONTRACT_NAMES } from '@/enums'

import { config } from '@/config'

export interface FarmingContract {
  address: Ref<string>
  investmentToken: Ref<string>
  rewardToken: Ref<string>
  init: () => void
  loadDetails: () => Promise<void>
  updateInvestmentToken: () => Promise<void>
  updateRewardToken: () => Promise<void>
}

export const useFarming = (): FarmingContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Farming | undefined>()
  const _instance_rw = ref<Farming | undefined>()

  const address = ref('')
  const investmentToken = ref('')
  const rewardToken = ref('')

  const init = (): void => {
    if (!provider.value.chainId) return

    address.value =
      config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.FARMING]

    if (provider.value.currentProvider) {
      _instance.value = Farming__factory.connect(
        address.value,
        provider.value.currentProvider,
      )
    }
    if (provider.value.currentSigner) {
      _instance_rw.value = Farming__factory.connect(
        address.value,
        provider.value.currentSigner,
      )
    }
  }

  const loadDetails = async (): Promise<void> => {
    if (!_instance.value) return

    await Promise.all([updateRewardToken()])
  }

  const updateInvestmentToken = async (): Promise<void> => {
    if (!_instance.value) return

    investmentToken.value = await _instance.value.investmentToken()
  }

  const updateRewardToken = async (): Promise<void> => {
    if (!_instance.value) return

    rewardToken.value = await _instance.value.rewardToken()
  }

  init()

  return {
    init,
    loadDetails,

    address,
    investmentToken,
    rewardToken,

    updateInvestmentToken,
    updateRewardToken,
  }
}
