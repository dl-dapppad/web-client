<script lang="ts" setup>
import { Ref } from 'vue'
import { Icon, AppButton } from '@/common'
import { useI18n } from 'vue-i18n'
import { ModalText, OverviewRow } from '@/modules/types'
import { OverviewRender } from '@/modules/common'

defineProps<{
  txt?: ModalText
  rows?: Ref<Array<OverviewRow>>
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
    <overview-render :rows="rows.value" />
    <app-button
      class="app__deploy-success-message__submit"
      :text="t('deploy-success-message.btn-lbl')"
      size="small"
      @click="emit('submit')"
    />
  </div>
</template>
