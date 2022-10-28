<script lang="ts" setup>
import { Icon, AppButton } from '@/common'

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="deploy-success-message">
    <div class="deploy-success-message__header">
      <icon
        class="deploy-success-message__header-icon"
        :name="$icons.checkCircle"
      />
      <h5 class="deploy-success-message__title">
        {{ 'Success!' }}
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
      {{
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took."
      }}
    </span>

    <div class="deploy-success-message__metadata">
      <div class="deploy-success-message__metadata-item">
        <span class="deploy-success-message__metadata-lbl">
          {{ 'Some text' }}
        </span>
        <span class="deploy-success-message__metadata-value">
          {{ '32 310 389.1234 USDT' }}
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

.deploy-success-message__metadata {
  display: flex;
  flex-direction: column;
  gap: toRem(24);
}

.deploy-success-message__metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deploy-success-message__metadata-lbl {
  font-size: toRem(14);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-secondary-main);
}

.deploy-success-message__metadata-value {
  text-align: right;
}

.deploy-success-message__submit {
  width: 100%;
  margin-top: toRem(40);
}
</style>
