<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  leftLbl?: string
  rightLbl?: string
  label?: {
    type: string
    default: ''
  }
}>()

enum EVENTS {
  updateModelValue = 'update:model-value',
}

const emit = defineEmits<{
  (e: EVENTS.updateModelValue, value: boolean): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit(EVENTS.updateModelValue, target.checked)
}
</script>

<template>
  <label class="switch-field" :class="{ 'switch-field--checked': modelValue }">
    <input
      v-bind="$attrs"
      class="switch-field__input"
      type="checkbox"
      :checked="modelValue"
      :name="$attrs.name || label"
      :value="modelValue"
      @change="handleChange"
    />

    <span class="switch-field__lbl" v-if="leftLbl">
      {{ leftLbl }}
    </span>
    <div class="switch-field__switch">
      <span
        class="switch-field__checkbox"
        :checked="modelValue"
        type="checkbox"
      />
    </div>
    <span class="switch-field__lbl" v-if="rightLbl">
      {{ rightLbl }}
    </span>
  </label>
</template>

<style lang="scss" scoped>
.switch-field__checkbox {
  display: flex;
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
}

.switch-field {
  display: flex;
  align-items: center;
  gap: inherit;
  cursor: pointer;

  &--checked {
    .switch-field__checkbox {
      background-color: var(--secondary-main);

      &:after {
        left: 70%;
      }
    }
  }
}

.switch-field__input {
  position: absolute;
  width: toRem(1);
  height: toRem(1);
  margin: calc(#{toRem(1)} * -1);
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}
</style>
