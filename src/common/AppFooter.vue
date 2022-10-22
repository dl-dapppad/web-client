<script lang="ts" setup>
import AppLogo from '@/common/AppLogo.vue'
import AppButton from '@/common/AppButton.vue'
</script>

<template>
  <div class="app-footer">
    <app-logo class="app-footer__logo" />
    <span class="app-footer__copyright">
      {{ $t('app-footer.copyright') }}
    </span>
    <app-button
      class="app-footer__terms-link"
      :icon-left="$icons.arrowCircleRight"
      :text="$t('app-footer.terms-link')"
      color="default"
      scheme="default"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-footer {
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;
  padding: toRem(10) var(--app-padding-right) toRem(10) var(--app-padding-left);
}

.app-footer__logo {
  max-width: toRem(70);
}

.app-footer__copyright {
  justify-self: center;
  color: var(--text-secondary-main);
  font-size: toRem(14);
  line-height: 1.2;
  font-weight: 500;
}

.app-footer__terms-link {
  justify-self: end;
  font-size: toRem(12);
  line-height: 1;
  font-weight: 700;
}
</style>
