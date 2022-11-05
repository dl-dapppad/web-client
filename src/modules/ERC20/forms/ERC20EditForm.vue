<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AppBlock, AppButton, Tabs } from '@/common'
import { BalanceForm, ApproveForm } from '@/forms'
import { cropAddress, copyToClipboard, formatAmount } from '@/helpers'
import { useProductErc20 } from '@/modules/ERC20/composables/use-product-erc20'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Editing',
      address: 'Contract {address}',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'block-title-1': 'Overview',
      'metadata-1-lbl': 'Total supply',
      'metadata-2-lbl': 'Token tracker',
      'metadata-3-lbl': 'Contract address',
      'metadata-4-lbl': 'Owner address',
      'metadata-5-lbl': 'Decimals',
      'metadata-6-lbl': 'Your balance',
      'block-title-2': 'Interaction',
    },
  },
})

const FORM_TABS = [
  {
    title: 'Read',
    number: 1,
  },
  {
    title: 'Write',
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const contractMetadata = ref({
  accountBalance: '0',
})

const router = useRouter()
const route = useRoute()
const erc20 = useProductErc20(route.params.contractAddress as string)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()

  if (provider.value.selectedAddress) {
    contractMetadata.value.accountBalance = await erc20.balanceOf(
      provider.value.selectedAddress,
    )
  }
}

init()
</script>

<template>
  <div class="erc20-edit-form">
    <div class="erc20-edit-form__titles-wrp">
      <div class="app__module-title-wrp">
        <app-button
          type="button"
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="router.go(-1)"
        />
        <h2 class="app__module-title">
          {{ t('title') }}
        </h2>
        <app-button
          type="button"
          class="app__module-title-address"
          :text="
            t('address', {
              address: cropAddress(
                '0xC87B0398F86276D3D590A14AB53fF57185899C42',
              ),
            })
          "
          :icon-right="$icons.duplicate"
          scheme="default"
          size="default"
          @click="copyToClipboard('0xC87B0398F86276D3D590A14AB53fF57185899C42')"
        />
      </div>
      <span class="app__module-subtitle">
        {{ t('subtitle') }}
      </span>
    </div>
    <div class="erc20-edit-form__block-wrp">
      <h3 class="app__module-block-title">
        {{ t('block-title-1') }}
      </h3>
      <app-block>
        <div class="app__module-content">
          <div class="app__metadata erc20-edit-form__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-1-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{
                    formatAmount(erc20.totalSupply.value, erc20.decimals.value)
                  }}
                  <span class="app__price-asset">
                    {{ erc20.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-2-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ `${erc20.name.value} (${erc20.symbol.value})` }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-3-lbl') }}
              </span>
              <span class="app__metadata-value">
                <app-button
                  scheme="default"
                  color="secondary"
                  size="default"
                  :text="cropAddress(erc20.address.value)"
                  @click="copyToClipboard(erc20.address.value)"
                />
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-4-lbl') }}
              </span>
              <span class="app__metadata-value">
                <app-button
                  scheme="default"
                  color="secondary"
                  size="default"
                  :text="cropAddress(erc20.owner.value)"
                  :icon-right="$icons.duplicate"
                  @click="copyToClipboard(erc20.owner.value)"
                />
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-5-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ erc20.decimals.value }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-6-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{
                    formatAmount(
                      contractMetadata.accountBalance,
                      erc20.decimals.value,
                    )
                  }}
                  <span class="app__price-asset">
                    {{ erc20.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </app-block>
    </div>
    <div class="erc20-edit-form__block-wrp">
      <h3 class="app__module-block-title">
        {{ t('block-title-2') }}
      </h3>
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <app-block>
        <div
          v-if="currentTabNumber === FORM_TABS[0].number"
          class="app__module-content"
        >
          <balance-form :token="erc20"></balance-form>
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <approve-form :token="erc20"></approve-form>
        </div>
      </app-block>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.erc20-edit-form {
  display: flex;
  flex-direction: column;
  gap: toRem(70);
}

.erc20-edit-form__titles-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.erc20-edit-form__form-control {
  &:not(:last-child) {
    margin-bottom: toRem(30);
  }
}
</style>
