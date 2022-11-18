<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { AppButton, AppLogo } from '@/common'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { width: windowWidth } = useWindowSize()

const isXSmall = computed(() => windowWidth.value <= WINDOW_BREAKPOINTS.xSmall)
</script>

<template>
  <div class="app-footer">
    <app-logo class="app-footer__logo" />
    <span class="app-footer__copyright">
      {{ $t('app-footer.copyright') }}
    </span>
    <app-button
      class="app-footer__terms-link"
      :icon-left="$icons.questionMarkCircleFilled"
      :text="$t('app-footer.terms-link')"
      :size="isXSmall ? 'small' : 'medium'"
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
  padding: toRem(30) var(--app-padding-right) toRem(30) var(--app-padding-left);

  @include respond-to(small) {
    padding: toRem(20) var(--app-padding-right) toRem(20)
      var(--app-padding-left);
    display: flex;
    flex-direction: column-reverse;
  }
}

.app-footer__logo {
  max-width: toRem(70);

  @include respond-to(small) {
    padding: toRem(16) toRem(32);
    max-width: toRem(134);
  }
}

.app-footer__copyright {
  justify-self: center;
  color: var(--text-secondary-main);
  font-size: toRem(14);
  line-height: 1.2;
  font-weight: 500;

  @include respond-to(small) {
    padding: toRem(16) toRem(32);
  }
}

.app-footer__terms-link {
  text-transform: capitalize;
  justify-self: end;
  font-size: toRem(14);
  line-height: 1;
  font-weight: 700;
  padding-left: 0;
  padding-right: 0;

  @include respond-to(small) {
    font-size: toRem(12);
  }
}
</style>
