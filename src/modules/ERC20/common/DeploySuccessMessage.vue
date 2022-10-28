<script lang="ts" setup>
import { Icon, AppButton } from '@/common'
import { useI18n } from 'vue-i18n'
import { formatNumber, cropAddress } from '@/helpers'

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'close'): void
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Success',
      /* eslint-disable quotes */
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
      /* eslint-enable */
      'token-name-lbl': 'Token name',
      'token-symbol-lbl': 'Token symbol',
      'token-decimals-lbl': 'Token decimals',
      'token-cap-lbl': 'Token cap',
      'token-minted-lbl': 'Token minted',
      'token-tracker-lbl': 'Token address',
    },
  },
})

const metadata = {
  name: 'Test token',
  symbol: 'TT',
  decimals: 18,
  cap: 10000000000000000,
  minted: {
    amount: 1000000,
    asset: 'TT',
  },
  tokenTracker: 'Tether USD (USDT)',
  contract: '0x0000000000000000000000000000000000000000',
}
</script>

<template>
  <div class="deploy-success-message">
    <div class="deploy-success-message__header">
      <icon
        class="deploy-success-message__header-icon"
        :name="$icons.checkCircle"
      />
      <h5 class="deploy-success-message__title">
        {{ t('title') }}
      </h5>
      <app-button
        scheme="default"
        color="default"
        size="default"
        :icon-right="$icons.x"
        @click="emit('close')"
      />
    </div>
    <span class="deploy-success-message__description">
      {{ t('description') }}
    </span>

    <div class="app__metadata">
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-name-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ metadata.name }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-symbol-lbl') }}
        </span>
        <span class="app__metadata-value">
          {{ metadata.symbol }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-tracker-lbl') }}
        </span>
        <span class="app__metadata-value app__metadata-value--accent">
          {{ metadata.tokenTracker }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-decimals-lbl') }}
        </span>
        <span class="app__metadata-value app__metadata-value--accent">
          {{ metadata.decimals }}
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-minted-lbl') }}
        </span>
        <span class="app__metadata-value">
          <span class="app__price">
            {{ formatNumber(metadata.minted.amount) }}
            <span class="app__price-asset">
              {{ metadata.contractOwner }}
            </span>
          </span>
        </span>
      </div>
      <div class="app__metadata-row">
        <span class="app__metadata-lbl">
          {{ t('token-minted-lbl') }}
        </span>
        <span class="app__metadata-value app__metadata-value--accent">
          {{ cropAddress(metadata.contract) }}
        </span>
      </div>
    </div>
    <app-button
      class="deploy-success-message__submit"
      :text="'Great'"
      size="small"
      @click="emit('submit')"
    />
  </div>
</template>

<style lang="scss" scoped>
.deploy-success-message {
  padding: toRem(24) toRem(42);
  max-width: toRem(550);
  width: 100%;
}

.deploy-success-message__header {
  display: flex;
  align-items: center;
  margin-bottom: toRem(40);
}

.deploy-success-message__header-icon {
  color: var(--secondary-main);
  width: toRem(24);
  height: toRem(24);
  margin-right: toRem(24);
}

.deploy-success-message__title {
  font-family: var(--app-font-family-secondary);
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-right: auto;
}

.deploy-success-message__description {
  display: block;
  font-size: toRem(16);
  line-height: 1.3;
  letter-spacing: 0.1em;
  margin: toRem(40) 0;
}

.deploy-success-message__submit {
  width: 100%;
  margin-top: toRem(40);
}
</style>
