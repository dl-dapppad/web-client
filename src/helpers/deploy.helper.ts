import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { useErc20, useProductFactory, Erc20Contract } from '@/composables'
import { Bus, getMaxUint256, getTxHashFromErrorMessage } from '@/helpers'
import { BN } from '@/utils'
import { Interface } from 'ethers/lib/utils'
import productFactoryAbi from '@/modules/ERC20/abi/ERC20.json'
import { config } from '@/config'

const approve = async (
  paymentTokenContract: Erc20Contract,
  address: string,
  paymentContractAddress: string,
  productPrice: string,
) => {
  const allowance = await paymentTokenContract.allowance(
    address,
    paymentContractAddress,
  )

  if (new BN(allowance).compare(productPrice) < 0) {
    try {
      const tx = await paymentTokenContract.approve(
        paymentContractAddress,
        getMaxUint256(),
      )
      Bus.success(`Transaction has been confirmed! ${tx.hash}`)
    } catch (e) {
      if (e instanceof Error)
        throw new Error(getTxHashFromErrorMessage(e?.message))
      else throw e
    }
  }
}

// TODO: implement function for getting ABI by productID
export const deploy = async (
  productId: string,
  paymentTokenAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeDataValues: any[],
): Promise<string> => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  if (!provider.value.chainId) throw new Error('Provider is not set')

  const alias = config.PRODUCT_ALIASES[productId as string]

  const factory = useProductFactory()
  const paymentTokenContract = useErc20(paymentTokenAddress)

  const _interface = new Interface(productFactoryAbi)
  const initializeData = _interface.encodeFunctionData(
    'ERC20_init',
    initializeDataValues,
  )

  let product = factory.getEmptyProduct()
  let paymentContractAddress = ''
  let potentialContractAddress = ''
  await Promise.all([
    factory.products(alias),
    factory.payment(),
    factory.getPotentialContractAddress(alias, initializeData),
  ]).then(res => {
    product = res[0]
    paymentContractAddress = res[1]
    potentialContractAddress = res[2]
    return
  })

  await approve(
    paymentTokenContract,
    provider.value.selectedAddress as string,
    paymentContractAddress,
    product.currentPrice,
  )

  try {
    const tx = await factory.deploy(alias, paymentTokenAddress, initializeData)
    Bus.success(`Transaction has been confirmed! ${tx.hash}`)
  } catch (e) {
    if (e instanceof Error)
      throw new Error(getTxHashFromErrorMessage(e?.message))
    else throw e
  }

  return potentialContractAddress
}
