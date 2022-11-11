<script lang="ts" setup>
import { AppButton } from '@/common'

import { useRouter } from '@/router'

const router = useRouter()
</script>

<template>
  <div class="page-404">
    <app-button
      class="page-404__back-btn"
      :icon-left="$icons.arrowLeft"
      modification="border-circle"
      color="tertiary"
      @click="
        router.push({
          name: $routes.categories,
          params: { id: `tokens` },
        })
      "
    />
    <div class="page-404__content">
      <img
        class="page-404__image"
        src="static/images/404.png"
        alt="404 Image"
      />
      <span class="page-404__sorry-text">
        {{ $t('page-404.title') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.page-404__back-btn {
  position: absolute;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  top: 10%;
  left: 10%;
  padding: 0;
}

.page-404__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(40);
  max-width: toRem(772);
}

.page-404__image {
  width: toRem(660);

  @include respond-to(tablet) {
    width: 100%;
  }
}

.page-404__sorry-text {
  color: var(--text-secondary-main);
  font-weight: 700;
  font-size: toRem(16);
  text-align: center;
}
</style>
