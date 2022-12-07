export interface DeployMetadata {
  name: string
  symbol: string
  erc20Metadata?: {
    decimals: string
    mintAmount: string
    mintReceiver: string
    contract: string
  }
  erc721Metadata?: {
    contract: string
  }
}

export { default as EditOverview } from '@/modules/common/EditOverview.vue'
export { default as DeploySuccessMessage } from '@/modules/common/DeploySuccessMessage.vue'
