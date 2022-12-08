export interface DeployMetadata {
  name: string
  symbol: string
  contract: string
  erc20Metadata?: {
    decimals: string
    mintAmount: string
    mintReceiver: string
  }
}

export { default as EditOverview } from '@/modules/common/EditOverview.vue'
export { default as DeploySuccessMessage } from '@/modules/common/DeploySuccessMessage.vue'
