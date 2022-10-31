<script lang="ts" setup>
import { AppButton, Icon, AppBlock } from '@/common'
import { cropAddress } from '@/helpers'
import { useRouter } from '@/router'
import { copyToClipboard } from '@/helpers'

const router = useRouter()
const address = '0xa1234567af'
</script>

<template>
  <div class="farming-page">
    <app-button
      class="farming-page__back-btn"
      :icon-left="$icons.arrowLeft"
      modification="border-circle"
      color="tertiary"
      @click="router.go(-1)"
    />
    <div class="farming-page__content">
      <div class="farming-page__title-wrp">
        <div class="farming-page__title">
          <div class="farming-page__heading">
            {{ $t('farming-page.title') }}
          </div>
          <div
            class="farming-page__title-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__title-icon" :name="$icons.duplicate" />
          </div>
        </div>
        <div class="farming-page__subtitle">
          {{ $t('farming-page.subtitle') }}
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.database" />
              {{ $t('farming-page.total-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.total-stake-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.total-stake-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.cube" />
              {{ $t('farming-page.my-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.my-stake-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.my-stake-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-buttons">
            <app-button
              class="farming-page__table-btn"
              size="large"
              color="tertiary"
            >
              {{ $t('farming-page.withdraw-btn') }}
            </app-button>
            <app-button class="farming-page__table-btn" size="large">
              {{ $t('farming-page.stake-btn') }}
            </app-button>
          </div>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{ $t('farming-page.stake-address-dapp-lbl') }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__table-icon" :name="$icons.duplicate" />
          </span>
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.gift" />
              {{ $t('farming-page.total-reward-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.total-reward-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.total-reward-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div
            class="farming-page__table-item farming-page__table-item--secondary"
          >
            <div class="farming-page__table-title">
              <icon
                class="farming-page__table-icon"
                :name="$icons.checkCircle"
              />
              {{ $t('farming-page.current-rewards-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.current-rewards-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.current-rewards-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <app-button class="farming-page__table-btn" size="large">
            {{ $t('farming-page.claim-btn') }}
          </app-button>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{ $t('farming-page.stake-address-dai-lbl') }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__table-icon" :name="$icons.duplicate" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.farming-page {
  padding: toRem(70) toRem(115) toRem(70) toRem(70);
  display: flex;
  gap: toRem(54);
  letter-spacing: 0.1em;
}

.farming-page__back-btn {
  width: toRem(54);
  height: toRem(54);
  padding: 0;
  transform: translateY(toRem(12.5));
}

.farming-page__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: toRem(40);
}

.farming-page__title-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.farming-page__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.farming-page__heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 900;
  font-size: toRem(70);
  letter-spacing: 0.1em;
}

.farming-page__title-address {
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
  font-size: toRem(30);
  display: flex;
  align-items: center;
  gap: toRem(20);
  cursor: pointer;
}

.farming-page__title-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__subtitle {
  font-size: toRem(16);
}

.farming-page__table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.farming-page__table-title {
  display: flex;
  gap: toRem(14);
  font-size: toRem(16);
  font-family: var(--app-font-family-secondary);
  font-weight: 600;
  color: var(--text-secondary-main);
}

.farming-page__table-icon {
  width: toRem(16);
  height: toRem(16);
  color: var(--text-primary-main);
}

.farming-page__table-item {
  padding: toRem(30) toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  border-radius: toRem(12);

  &--secondary {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & .farming-page__table-title {
      color: var(--text-primary-invert-main);

      & .farming-page__table-icon {
        color: var(--text-primary-invert-main);
      }
    }
  }
}

.farming-page__table-body {
  display: flex;
  align-items: flex-end;
  gap: toRem(6);
}

.farming-page__table-count {
  font-weight: 800;
  font-size: toRem(20);
}

.farming-page__table-currency {
  font-weight: 700;
  font-size: toRem(12);
}

.farming-page__table-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
}

.farming-page__table-btn {
  width: 100%;
  height: 100%;
}

.farming-page__table-desc {
  padding: toRem(14) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.farming-page__table-desc-text {
  font-size: toRem(12);
  color: var(--text-secondary-main);
  font-weight: 700;
}

.farming-page__table-desc-address {
  display: flex;
  gap: toRem(10);
  color: var(--secondary-main);
  font-weight: 700;
  cursor: pointer;
}
</style>
