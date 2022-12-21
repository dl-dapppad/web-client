<script lang="ts" setup>
import { Icon, AppButton, AddressCopy } from '@/common'
import { useI18n } from 'vue-i18n'
import { DeployMetadata } from '@/modules/common'
import { ModalText } from '@/modules/types'

defineProps<{
  txt?: ModalText
  deployMetadata: DeployMetadata
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'close'): void
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'deploy-success-message.title': 'Success',
      'deploy-success-message.description':
        'Congratulations! You’ve just deployed your contract!',
      'deploy-success-message.name-lbl': 'Name',
      'deploy-success-message.symbol-lbl': 'Symbol',
      'deploy-success-message.decimals-lbl': 'Decimals',
      'deploy-success-message.mint-amount-lbl': 'Minted',
      'deploy-success-message.mint-receiver-lbl': 'Minted to',
      'deploy-success-message.contract-lbl': 'Contract address',
      'deploy-success-message.btn-lbl': 'Go to edit',
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
        {{ txt?.title ?? t('deploy-success-message.title') }}
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
      {{ txt?.description ?? t('deploy-success-message.description') }}
    </span>

    <div v-if="deployMetadata" class="app__metadata">
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.name-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.name }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.symbol-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.symbol }}
        </span>
      </div>
      <div class="app__metadata-row" v-if="deployMetadata.erc20Metadata">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.decimals-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.erc20Metadata.decimals }}
        </span>
      </div>
      <div class="app__metadata-row" v-if="deployMetadata.erc20Metadata">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.mint-amount-lbl') }}
        </span>
        <span class="app__metadata-value">
          <span class="app__price">
            {{ deployMetadata.erc20Metadata.mintAmount }}
            <span class="app__price-asset">
              {{ deployMetadata.symbol }}
            </span>
          </span>
        </span>
      </div>
      <div class="app__metadata-row" v-if="deployMetadata.erc20Metadata">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.mint-receiver-lbl') }}
        </span>
        <address-copy
          :address="deployMetadata.erc20Metadata.mintReceiver"
          class="app__link--accented"
        />
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-success-message.contract-lbl') }}
        </span>
        <address-copy
          :address="deployMetadata.contract"
          class="app__link--accented"
        />
      </div>
    </div>
    <app-button
      class="app__deploy-success-message__submit"
      :text="t('deploy-success-message.btn-lbl')"
      size="small"
      @click="emit('submit')"
    />
  </div>
</template>
