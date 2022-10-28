import { ref } from 'vue'
import { ethers } from 'ethers'
import { config } from '@config'
import { FarmingContract } from '@/types'
import { Farming, Farming__factory } from '@/types'

export const useFarming = (
  currentProvider?: ethers.providers.Web3Provider,
  currentSigner?: ethers.providers.JsonRpcSigner,
  address?: string,
): FarmingContract => {
  const _instance = ref<Farming | undefined>()
  const _instance_rw = ref<Farming | undefined>()

  const init = (contractAddress: string): void => {
    address = contractAddress

    if (currentProvider) {
      _instance.value = Farming__factory.connect(
        contractAddress,
        currentProvider,
      )
    }
    if (currentSigner) {
      _instance_rw.value = Farming__factory.connect(
        contractAddress,
        currentSigner,
      )
    }
  }

  if (!address) init(config.CONTRACT_FARMING)
  else init(address ?? '')

  const investmentToken = ref('')
  const rewardToken = ref('')

  const loadDetails = async (): Promise<void> => {
    if (!_instance.value) return

    await Promise.all([updateRewardToken()])
  }

  const getAddress = (): string => {
    return address ?? ''
  }

  const updateInvestmentToken = async (): Promise<void> => {
    if (!_instance.value) return

    investmentToken.value = await _instance.value.investmentToken()
  }

  const updateRewardToken = async (): Promise<void> => {
    if (!_instance.value) return

    rewardToken.value = await _instance.value.rewardToken()
  }

  return {
    init,
    loadDetails,
    getAddress,

    investmentToken,
    rewardToken,

    updateInvestmentToken,
    updateRewardToken,
  }
}
