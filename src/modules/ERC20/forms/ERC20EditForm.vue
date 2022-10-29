<script lang="ts" setup>
import { AppBlock, AppButton, Tabs } from '@/common'
import { InputField } from '@/fields'

import {
  Bus,
  cropAddress,
  ErrorHandler,
  formatNumber,
  copyToClipboard,
} from '@/helpers'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Editing',
      address: 'Contract {address}',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'content-title-1': 'Read block',
      'metadata-1-lbl': 'Max total supplies',
      'metadata-2-lbl': 'Contract creator',
      'metadata-3-lbl': 'Token tracker',
      'metadata-4-lbl': 'Contract owner',
      'metadata-5-lbl': 'Contract',
      'metadata-6-lbl': 'Decimals',
      'metadata-7-lbl': 'Your balance',
      'content-title-2': 'Edit block',
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

const approveForm = reactive({
  spenderAddress: '',
  valueAmount: '',
})

const transferFromForm = reactive({
  fromAddress: '',
  toAddress: '',
  valueAmount: '',
})

const transferForm = reactive({
  toAddress: '',
  valueAmount: '',
})

const transferOwnershipForm = reactive({
  newOwnerAddress: '',
})

const handleApprove = () => {
  try {
    Bus.success('approve')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransferFrom = () => {
  try {
    Bus.success('transferFrom')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransfer = () => {
  try {
    Bus.success('transfer')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransferOwnership = () => {
  try {
    Bus.success('transferOwnership')
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<template>
  <div class="erc20-edit-form">
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
            address: cropAddress('0xC87B0398F86276D3D590A14AB53fF57185899C42'),
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
    <tabs
      v-model="currentTabNumber"
      :tabs-data="[
        { title: 'Read', number: 1 },
        { title: 'Write', number: 2 },
      ]"
    />
    <app-block>
      <div class="app__module-content">
        <h4 class="app__module-content-title">
          {{ t('content-title-1') }}
        </h4>
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
        <h4 class="app__module-content-title">
          {{ t('content-title-2') }}
        </h4>
        <div class="app__form-control">
          <span class="app__form-control-title">
            {{ t('approve-form.title') }}
          </span>
          <input-field
            v-model="approveForm.spenderAddress"
            scheme="secondary"
            :label="t('approve-form.spender-address-lbl')"
          />
          <input-field
            v-model="approveForm.valueAmount"
            scheme="secondary"
            :label="t('approve-form.value-amount-lbl')"
          />
          <app-button
            type="button"
            :text="t('approve-form.submit-btn')"
            size="small"
            @click="handleApprove"
          />
        </div>
        <div class="app__form-control">
          <span class="app__form-control-title">
            {{ t('transfer-from-form.title') }}
          </span>
          <input-field
            v-model="transferFromForm.fromAddress"
            scheme="secondary"
            :label="t('transfer-from-form.from-address-lbl')"
          />
          <input-field
            v-model="transferFromForm.toAddress"
            scheme="secondary"
            :label="t('transfer-from-form.to-address-lbl')"
          />
          <input-field
            v-model="transferFromForm.valueAmount"
            scheme="secondary"
            :label="t('transfer-from-form.value-amount-lbl')"
          />
          <app-button
            type="button"
            :text="t('transfer-from-form.submit-btn')"
            size="small"
            @click="handleTransferFrom"
          />
        </div>
        <div class="app__form-control">
          <span class="app__form-control-title">
            {{ t('transfer-form.title') }}
          </span>
          <input-field
            v-model="transferForm.toAddress"
            scheme="secondary"
            :label="t('transfer-form.to-lbl')"
          />
          <input-field
            v-model="transferForm.valueAmount"
            scheme="secondary"
            :label="t('transfer-form.value-lbl')"
          />
          <app-button
            type="button"
            :text="t('transfer-form.submit-btn')"
            size="small"
            @click="handleTransfer"
          />
        </div>
        <div class="app__form-control">
          <span class="app__form-control-title">
            {{ t('transfer-ownership-form.title') }}
          </span>
          <input-field
            v-model="transferOwnershipForm.newOwnerAddress"
            scheme="secondary"
            :label="t('transfer-ownership-form.new-owner-lbl')"
          />
          <app-button
            type="button"
            :text="t('transfer-ownership-form.submit-btn')"
            size="small"
            @click="handleTransferOwnership"
          />
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.erc20-edit-form__metadata {
  margin: 0 0 toRem(70);
}
</style>
