export interface DeployERC20Metadata {
  name: string
  symbol: string
  decimals: string
  mintAmount: string
  mintReceiver: string
  contract: string
}

export { default as DeploySuccessMessage } from './DeploySuccessMessage.vue'
