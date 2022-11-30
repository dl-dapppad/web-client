import { ethers } from 'ethers'
import { useRouter } from 'vue-router'
import { i18n } from '@/localization'
import { Bus } from '@/helpers'
import { ROUTE_NAMES, PRODUCT_IDS } from '@/enums'
import { useProductErc20 } from '@/modules/erc20/erc20/composables/use-product-erc20'
import { useProductErc721 } from '@/modules/erc721/erc721/composables/use-product-erc721'

export const useProduct = () => {
  const router = useRouter()

  const handleContractSearch = async (address: string) => {
    const productType = await getProductTypeByAddress(address)
    if (!productType) return

    router.push({
      name: ROUTE_NAMES.productEdit,
      params: { id: productType, contractAddress: address },
    })
  }

  const getProductTypeByAddress = async (
    address: string,
  ): Promise<PRODUCT_IDS | undefined> => {
    const { t } = i18n.global

    if (!ethers.utils.isAddress(address)) {
      Bus.warning(t('errors.address-invalid'))
      return
    }

    try {
      const erc20 = useProductErc20(address)
      await erc20.updateDecimals()

      return PRODUCT_IDS.ERC20
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      const erc721 = useProductErc721(address)
      await erc721.updateBaseURI()

      return PRODUCT_IDS.ERC721
      // eslint-disable-next-line no-empty
    } catch {}

    Bus.warning(t('errors.address-not-found'))
  }

  return {
    handleContractSearch,
    getProductTypeByAddress,
  }
}
