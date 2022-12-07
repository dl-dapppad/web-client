<script lang="ts" setup>
import { Icon, AppButton, LinkCopy } from '@/common'
import { useI18n } from 'vue-i18n'
import { DeployMetadata } from '@/modules/common'

defineProps<{
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
      'deploy-erc20.title': 'Success',
      'deploy-erc20.description':
        'Congratulations! You’ve just deployed your contract for Fungible Tokens!',
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

    <div v-if="deployMetadata" class="app__metadata">
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.name-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.name }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.symbol-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.symbol }}
        </span>
      </div>
      <div class="app__metadata-row" v-if="deployMetadata.erc20Metadata">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.decimals-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ deployMetadata.erc20Metadata.decimals }}
        </span>
      </div>
      <div class="app__metadata-row" v-if="deployMetadata.erc20Metadata">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.mint-amount-lbl') }}
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
          {{ t('deploy-erc20.mint-receiver-lbl') }}
        </span>
        <link-copy
          :address="deployMetadata.erc20Metadata.mintReceiver"
          class="app__link--accented"
        />
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('deploy-erc20.contract-lbl') }}
        </span>
        <link-copy
          :address="deployMetadata.contract"
          class="app__link--accented"
        />
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
