<template>
  <div class="app-block">
    <div class="app-block__inner">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-block {
  background: var(--border-secondary-main);
  padding: toRem(1);
}

.app-block__inner {
  border-radius: toRem(12);
  background: var(--background-primary);
  width: 100%;
  height: 100%;
}
</style>
