<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

enum EVENTS {
  updateIsShown = 'update:is-shown',
}

const drawerContent = ref<HTMLElement | undefined>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
    indentTop?: number
  }>(),
  {
    isCloseByClickOutside: false,
    indentTop: 1000,
  },
)

const emit = defineEmits<{
  (e: EVENTS.updateIsShown, value: boolean): void
}>()

onMounted(() => {
  if (drawerContent.value && props.isCloseByClickOutside) {
    onClickOutside(drawerContent, () => {
      closeDrawer()
    })
  }
})

const closeDrawer = () => {
  emit(EVENTS.updateIsShown, false)
}
</script>

<template>
  <transition name="drawer__transition">
    <div v-if="isShown" class="drawer">
      <div class="drawer__content" ref="drawerContent">
        <slot />
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
$drawer-padding-horizontal: toRem(12);
$drawer-padding-vertical: toRem(12);
$z-drawer: 100;

.drawer {
  position: fixed;
  width: 100%;
  height: calc(100% - #{toRem(65)});
  top: toRem(65);
  left: 0;
  z-index: $z-drawer;
  background: var(--background-primary);
  overflow: hidden;
}

.drawer__aside {
  display: flex;
  flex-direction: column;
  background: var(--background-primary-dark);
  border-radius: toRem(16) 0 0 toRem(16);
  padding: $drawer-padding-vertical $drawer-padding-horizontal;
  height: 100%;
  max-width: toRem(360);
  margin-left: auto;
}

.drawer__content {
  overflow: auto;
  height: 100%;
  width: 100%;
}

.drawer__header {
  padding-right: toRem(12);
  margin-bottom: toRem(18);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer__transition-enter-active {
  animation: fade-unroll-right 0.5s ease-in-out;
}

.drawer__transition-leave-active {
  animation: fade-unroll-right 0.5s ease-in-out reverse;
}

@keyframes fade-unroll-right {
  from {
    height: 0;
  }

  to {
    height: calc(100% - #{toRem(70)});
  }
}
</style>
