<script lang="ts" setup>
import { AppLogo, Icon } from '@/common'
</script>

<template>
  <div class="app-footer">
    <app-logo class="app-footer__logo" />
    <span class="app-footer__copyright">
      {{ $t('app-footer.copyright') }}
    </span>
    <span class="app-footer__terms-link">
      <icon
        class="app-footer__terms-link-icon"
        :name="$icons.questionMarkCircleFilled"
      />
      {{ $t('app-footer.terms-link') }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.app-footer {
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;
  padding: toRem(50) var(--app-padding-right) toRem(50) var(--app-padding-left);

  @include respond-to(small) {
    padding: toRem(20) var(--app-padding-right) toRem(20)
      var(--app-padding-left);
    display: flex;
    flex-direction: column;
    gap: toRem(18);
  }
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
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(14);
  font-weight: 700;
  line-height: 1;
  text-transform: capitalize;
  justify-self: end;

  @include respond-to(xsmall) {
    font-size: toRem(12);
  }
}

.app-footer__terms-link-icon {
  max-width: toRem(12);
  max-height: toRem(12);
  min-width: toRem(12);
  min-height: toRem(12);
}
</style>
