<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AppBlock, AppButton, Tabs } from '@/common'
import { CommonForm } from '@/forms'
import {
  Bus,
  cropAddress,
  ErrorHandler,
  copyToClipboard,
  formatAmount,
} from '@/helpers'
import { useProductErc20 } from '@/modules/ERC20/composables/use-product-erc20'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { required, isAddress, numeric } from '@/validators'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Editing',
      address: 'Contract {address}',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'block-title-1': 'General info of Overview',
      'metadata-1-lbl': 'Total supply',
      'metadata-2-lbl': 'Token tracker',
      'metadata-3-lbl': 'Contract address',
      'metadata-4-lbl': 'Owner address',
      'metadata-5-lbl': 'Decimals',
      'metadata-6-lbl': 'Your balance',
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
const accountBalance = ref('0')

const router = useRouter()
const route = useRoute()
const erc20 = useProductErc20(route.params.contractAddress as string)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()
  if (provider.value.selectedAddress) {
    accountBalance.value = await erc20.balanceOf(provider.value.selectedAddress)
  }
}

init()

const handleApprove = () => {
  try {
    Bus.success('approve')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const formScheme = {
  title: t('approve-form.title'),
  titleInfo: 'Some title info',
  fieelds: [
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
                  {{ formatAmount(accountBalance, erc20.decimals.value) }}
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
            :form-scheme="formScheme"
            class="erc20-edit-form__form-control"
            @submit="handleApprove"
          />
        </div>
      </app-block>
    </div>
  </div>
</template>

<!-- <template>
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
        :text="cropAddress(erc20.address.value)"
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
                {{ formatAmount(accountBalance, erc20.decimals.value) }}
                <span class="app__price-asset">
                  {{ erc20.symbol.value }}
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
            :form-scheme="formScheme"
            class="erc20-edit-form__form-control"
            @submit="handleApprove"
          />
        </div>
      </app-block>
    </div>
  </div>
</template> -->

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
