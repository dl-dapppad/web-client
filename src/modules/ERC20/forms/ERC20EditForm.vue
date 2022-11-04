<script lang="ts" setup>
import { AppBlock, AppButton, Tabs } from '@/common'
import { CommonForm } from '@/forms'

import {
  Bus,
  cropAddress,
  ErrorHandler,
  formatNumber,
  copyToClipboard,
} from '@/helpers'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { required, isAddress, numeric } from '@/validators'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Editing',
      address: 'Contract {address}',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'block-title-1': 'General info of Overview',
      'metadata-1-lbl': 'Max total supplies',
      'metadata-2-lbl': 'Contract creator',
      'metadata-3-lbl': 'Token tracker',
      'metadata-4-lbl': 'Contract owner',
      'metadata-5-lbl': 'Contract',
      'metadata-6-lbl': 'Decimals',
      'metadata-7-lbl': 'Your balance',
      'block-title-2': 'Interaction',
      'approve-form': {
        title: 'Approve',
        'spender-address-lbl': 'Spender',
        'value-amount-lbl': 'Value',
        'submit-btn': 'Save Changes',
      },
      'transfer-from-form': {
        title: 'Transfer From',
        'from-address-lbl': 'From',
        'to-address-lbl': 'To',
        'value-amount-lbl': 'Value',
        'submit-btn': 'Save Changes',
      },
      'transfer-form': {
        title: 'Transfer',
        'to-lbl': 'To',
        'value-lbl': 'Value',
        'submit-btn': 'Save Changes',
      },
      'transfer-ownership-form': {
        title: 'Transfer Ownership',
        'new-owner-lbl': 'New owner address',
        'submit-btn': 'Save Changes',
      },
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

const router = useRouter()

const metadata = {
  maxTotalSupplie: {
    amount: 32310389.1234,
    asset: 'USDT',
  },
  contractCreator: '0xC87B0398F86276D3D590A14AB53fF57185899C42',
  tokenTracker: 'Tether USD (USDT)',
  contractOwner: '0xC87B0398F86276D3D590A14AB53fF57185899C42',
  contract: '0xC87B0398F86276D3D590A14AB53fF57185899C42',
  decimals: 6,
  yourBalance: {
    amount: 32310389.1234,
    asset: 'USDT',
  },
}

const handleApprove = () => {
  try {
    Bus.success('approve')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const formData = {
  title: t('approve-form.title'),
  titleInfo: 'Some title info',
  inputs: [
    {
      label: t('approve-form.spender-address-lbl'),
      info: 'Information about this input',
      validators: [required, isAddress],
    },
    {
      label: t('approve-form.value-amount-lbl'),
      info: 'Information about this input',
      validators: [required, numeric],
    },
  ],
  button: 'Button text',
}
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
                  {{ formatNumber(metadata.maxTotalSupplie.amount) }}
                  <span class="app__price-asset">
                    {{ metadata.maxTotalSupplie.asset }}
                  </span>
                </span>
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-2-lbl') }}
              </span>
              <span class="app__metadata-value">
                <app-button
                  scheme="default"
                  color="secondary"
                  size="default"
                  :text="cropAddress(metadata.contractCreator)"
                  :icon-right="$icons.duplicate"
                  @click="copyToClipboard(metadata.contractCreator)"
                />
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
                  :text="metadata.tokenTracker"
                  @click="copyToClipboard(metadata.tokenTracker)"
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
                  :text="cropAddress(metadata.contractOwner)"
                  :icon-right="$icons.duplicate"
                  @click="copyToClipboard(metadata.contractOwner)"
                />
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-5-lbl') }}
              </span>
              <span class="app__metadata-value">
                <app-button
                  scheme="default"
                  color="secondary"
                  size="default"
                  :text="cropAddress(metadata.contract)"
                  :icon-right="$icons.duplicate"
                  @click="copyToClipboard(metadata.contract)"
                />
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-6-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ metadata.decimals }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ t('metadata-7-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{ formatNumber(metadata.yourBalance.amount) }}
                  <span class="app__price-asset">
                    {{ metadata.yourBalance.asset }}
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
      <tabs
        v-model="currentTabNumber"
        :tabs-data="[
          { title: 'Read', number: 1 },
          { title: 'Write', number: 2 },
        ]"
      />
      <app-block>
        <div class="app__module-content">
          <common-form
            :form-data="formData"
            class="erc20-edit-form__form-control"
            @submit="handleApprove"
          />
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
