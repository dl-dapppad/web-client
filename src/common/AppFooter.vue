<script lang="ts" setup>
import { AppButton, AppLogo } from '@/common'
import { useBreakpoints } from '@/composables'

const breakpoints = useBreakpoints()
</script>

<template>
  <div class="app-footer">
    <app-logo class="app-footer__logo" />
    <app-button
      class="app-footer__github-link"
      :icon-left="$icons.gitlab"
      :text="$t('app-footer.gitlab-link')"
      :size="breakpoints.isXSmall.value ? 'small' : 'medium'"
      href="https://gitlab.com/dapppad"
      target="blank"
      color="default"
      scheme="default"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.app-footer__github-link {
  font-size: toRem(12);
  line-height: 1;
  font-weight: 700;
  padding-left: 0;
  padding-right: 0;

  @include respond-to(small) {
    font-size: toRem(12);
  }
}
</style>
