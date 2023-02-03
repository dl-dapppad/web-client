import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ContractTransaction } from 'ethers'

import { useWeb3ProvidersStore } from '@/store'
import { errors } from '@/errors'
import { Farming, Farming__factory } from '@/types'

export interface InvestInfo {
  amount: string
  rewards: string
}

export interface FarmingContract {
  address: Ref<string>
  investmentToken: Ref<string>
  rewardToken: Ref<string>
  totalInvestedAmount: Ref<string>
  totalRewardAmount: Ref<string>
  init: () => void
  loadDetails: () => Promise<void>
  updateInvestmentToken: () => Promise<void>
  updateRewardToken: () => Promise<void>
  updateTotalInvestedAmount: () => Promise<void>
  updateTotalRewardAmount: () => Promise<void>
  accountInvestInfo: (address: string) => Promise<InvestInfo>
  getRewards: (address: string) => Promise<string>
  invest: (args: Record<string, string>) => Promise<ContractTransaction>
  claim: (args: Record<string, string>) => Promise<ContractTransaction>
  withdraw: (args: Record<string, string>) => Promise<ContractTransaction>
}

export const useFarming = (): FarmingContract => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const _instance = ref<Farming | undefined>()
  const _instance_rw = ref<Farming | undefined>()

  const address = ref('')
  const investmentToken = ref('')
  const rewardToken = ref('')
  const totalInvestedAmount = ref('')
  const totalRewardAmount = ref('')

  const init = (): void => {
    if (!provider.value.chainId) return

    address.value = ''
    // address.value =
    //   config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.FARMING]

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

    await Promise.all([
      updateRewardToken(),
      updateInvestmentToken(),
      updateTotalInvestedAmount(),
      updateTotalRewardAmount(),
    ])
  }

  const updateInvestmentToken = async (): Promise<void> => {
    if (!_instance.value) return

    investmentToken.value = await _instance.value.investmentToken()
  }

  const updateRewardToken = async (): Promise<void> => {
    if (!_instance.value) return

    rewardToken.value = await _instance.value.rewardToken()
  }

  const updateTotalInvestedAmount = async (): Promise<void> => {
    if (!_instance.value) return

    totalInvestedAmount.value = (
      await _instance.value.getTotalInvestedAmount()
    ).toString()
  }

  const updateTotalRewardAmount = async (): Promise<void> => {
    if (!_instance.value) return

    totalRewardAmount.value = (
      await _instance.value.getTotalRewardAmount()
    ).toString()
  }

  const accountInvestInfo = async (address: string): Promise<InvestInfo> => {
    if (!_instance.value) return { amount: '0', rewards: '0' }

    const res = await _instance.value.accountInvestInfo(address)
    return {
      amount: res.amount.toString(),
      rewards: res.rewards.toString(),
    }
  }

  const getRewards = async (address: string): Promise<string> => {
    if (!_instance.value) return '0'

    return (await _instance.value.getRewards(address)).toString()
  }

  const invest = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.invest(args.amount)
  }

  const claim = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.claim(args.account)
  }

  const withdraw = async (
    args: Record<string, string>,
  ): Promise<ContractTransaction> => {
    if (!_instance_rw.value) throw new errors.ProviderNotSupportedError()

    return _instance_rw.value.withdraw(args.amount, args.receiver)
  }

  init()

  return {
    init,
    loadDetails,

    address,
    investmentToken,
    rewardToken,
    totalInvestedAmount,
    totalRewardAmount,

    updateInvestmentToken,
    updateRewardToken,
    updateTotalInvestedAmount,
    updateTotalRewardAmount,
    getRewards,
    accountInvestInfo,
    invest,
    claim,
    withdraw,
  }
}
