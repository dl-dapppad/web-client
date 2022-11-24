<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { Icon, AppButton } from '@/common'
import { copyToClipboard, cropAddress } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { DeployERC20Metadata } from '@/modules/erc20/common'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const props = defineProps<{
  deployMetadata?: DeployERC20Metadata
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'close'): void
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'deploy-erc20.title': 'Success',
      /* eslint-disable quotes */
      'deploy-erc20.description':
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
      /* eslint-enable */
      'deploy-erc20.name-lbl': 'Name',
      'deploy-erc20.symbol-lbl': 'Symbol',
      'deploy-erc20.decimals-lbl': 'Decimals',
      'deploy-erc20.mint-amount-lbl': 'Minted',
      'deploy-erc20.mint-receiver-lbl': 'Minted to',
      'deploy-erc20.contract-lbl': 'Contract address',
      'deploy-erc20.btn-lbl': 'Go to edit',
    },
  },
})
</script>

<template>
  <div class="app__deploy-success-message">
    <div class="app__deploy-success-message__header">
      <icon
        class="app__deploy-success-message__header-icon"
        :name="$icons.checkCircle"
      />
      <h5 class="app__deploy-success-message__title">
        {{ t('deploy-erc20.title') }}
      </h5>
      <app-button
        scheme="default"
        color="default"
        size="default"
        :icon-right="$icons.x"
        @click="emit('close')"
      />
    </div>
    <span class="app__deploy-success-message__description">
      {{ t('deploy-erc20.description') }}
    </span>

    <div v-if="props.deployMetadata" class="app__metadata">
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.name-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ props.deployMetadata.name }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.symbol-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ props.deployMetadata.symbol }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.decimals-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ props.deployMetadata.decimals }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.mint-amount-lbl') }}
        </span>
        <span class="app__metadata-value">
          <span class="app__price">
            {{ props.deployMetadata.mintAmount }}
            <span class="app__price-asset">
              {{ props.deployMetadata.symbol }}
            </span>
          </span>
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.mint-receiver-lbl') }}
        </span>
        <span :title="props.deployMetadata.mintReceiver" class="app__link-wrp">
          <a
            class="app__link app__link--accented"
            :href="provider.getAddressUrl(props.deployMetadata.mintReceiver)"
            target="_blank"
          >
            {{ cropAddress(props.deployMetadata.mintReceiver) }}
          </a>
          <app-button
            class="app__link-icon-wrp"
            scheme="default"
            @click="copyToClipboard(props.deployMetadata?.mintReceiver ?? '')"
          >
            <icon class="app__link-icon" :name="$icons.duplicateFilled" />
          </app-button>
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.contract-lbl') }}
        </span>
        <span :title="props.deployMetadata.contract" class="app__link-wrp">
          <a
            class="app__link app__link--accented"
            :href="provider.getAddressUrl(props.deployMetadata.contract)"
            target="_blank"
          >
            {{ cropAddress(props.deployMetadata.contract) }}
          </a>
          <app-button
            class="app__link-icon-wrp"
            scheme="default"
            @click="copyToClipboard(props.deployMetadata?.contract ?? '')"
          >
            <icon class="app__link-icon" :name="$icons.duplicateFilled" />
          </app-button>
        </span>
      </div>
    </div>
    <app-button
      class="app__deploy-success-message__submit"
      :text="t('deploy-erc20.btn-lbl')"
      size="small"
      @click="emit('submit')"
    />
  </div>
</template>
