<script lang="ts" setup>
import { Icon, AppButton } from '@/common'
import { copyToClipboard } from '@/helpers'
import { useI18n } from 'vue-i18n'

export interface DeployERC721Metadata {
  name: string
  symbol: string
  contract: string
}

const props = defineProps<{
  deployMetadata?: DeployERC721Metadata
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'close'): void
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'deploy-erc721.title': 'Success',
      'deploy-erc721.description':
        // eslint-disable-next-line quotes
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
      'deploy-erc721.name-lbl': 'Name',
      'deploy-erc721.symbol-lbl': 'Symbol',
      'deploy-erc721.decimals-lbl': 'Decimals',
      'deploy-erc721.mint-amount-lbl': 'Minted',
      'deploy-erc721.mint-receiver-lbl': 'Minted to',
      'deploy-erc721.contract-lbl': 'Contract address',
      'deploy-erc721.btn-lbl': 'Go to edit',
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
        {{ t('deploy-erc721.title') }}
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
      {{ t('deploy-erc721.description') }}
    </span>

    <div v-if="props.deployMetadata" class="app__metadata">
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc721.name-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ props.deployMetadata.name }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc721.symbol-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ props.deployMetadata.symbol }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc721.contract-lbl') }}
        </span>
        <app-button
          scheme="default"
          color="secondary"
          size="default"
          :text="props.deployMetadata.contract"
          :icon-right="$icons.duplicate"
          @click="copyToClipboard(props.deployMetadata?.contract ?? '')"
        />
      </div>
    </div>
    <app-button
      class="app__deploy-success-message__submit"
      :text="t('deploy-erc721.btn-lbl')"
      size="small"
      @click="emit('submit')"
    />
  </div>
</template>
