<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  leftLbl?: string
  rightLbl?: string
}>()

enum EVENTS {
  updateModelValue = 'update:model-value',
}

const emit = defineEmits<{
  (e: EVENTS.updateModelValue, value: boolean): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit(EVENTS.updateModelValue, target.checked)
}
</script>

<template>
  <div class="switch-field">
    <span class="switch-field__lbl" v-if="leftLbl">
      {{ leftLbl }}
    </span>
    <div class="switch-field__switch">
      <input
        class="switch-field__checkbox"
        :checked="modelValue"
        type="checkbox"
        @change="onChange"
      />
    </div>
    <span class="switch-field__lbl" v-if="rightLbl">
      {{ rightLbl }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.switch-field {
  display: flex;
  align-items: center;
  gap: toRem(20);
}

.switch-field__checkbox {
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: toRem(100);
  width: toRem(52);
  height: toRem(32);
  outline: none;
  background-color: var(--primary-main);
  -webkit-appearance: none;
  transition: 0.2s;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    height: toRem(24);
    width: toRem(24);
    background-color: var(--text-primary-invert-main);
    transition: 0.2s;
  }

  &:checked {
    background-color: var(--secondary-main);

    &:after {
      left: 70%;
    }
  }
}

.switch-field__lbl {
  font-family: var(--app-font-family-secondary);
  font-size: toRem(16);
  font-weight: 700;
  letter-spacing: 0.1em;
}
</style>
