<script lang="ts" setup>
import { Icon } from '@/common'

import { computed, useAttrs } from 'vue'
import { LocationAsRelativeRaw } from 'vue-router'
import { ICON_NAMES } from '@/enums'

type SCHEMES = 'filled' | 'flat' | 'borderless' | 'default'

type MODIFICATIONS = 'border-circle' | 'border-rounded' | 'default'

type COLORS =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'

type SIZES = 'large' | 'medium' | 'small' | 'x-small' | 'default'

const props = withDefaults(
  defineProps<{
    text?: string
    scheme?: SCHEMES
    modification?: MODIFICATIONS
    color?: COLORS
    size?: SIZES
    route?: LocationAsRelativeRaw
    href?: string
    iconLeft?: ICON_NAMES
    iconRight?: ICON_NAMES
  }>(),
  {
    text: '',
    scheme: 'filled',
    modification: 'default',
    color: 'primary',
    size: 'medium',
    route: undefined,
    href: '',
    iconLeft: undefined,
    iconRight: undefined,
  },
)

const attrs = useAttrs()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const buttonClasses = computed(() =>
  [
    'app-button',
    `app-button--${props.scheme}`,
    `app-button--${props.modification}`,
    `app-button--${props.color}`,
    `app-button--${props.size}`,
    ...(isDisabled.value ? ['app-button--disabled'] : []),
  ].join(' '),
)
</script>

<template>
  <template v-if="route">
    <router-link
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :to="route"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </router-link>
  </template>
  <template v-else-if="href">
    <a class="app-button" :class="buttonClasses" v-bind="$attrs" :href="href">
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </a>
  </template>
  <template v-else>
    <button
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :disabled="isDisabled"
      :type="$attrs.type || 'button'"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </button>
  </template>
</template>

<style lang="scss">
.app-button {
  --button-transition-duration: 0.2s;

  outline: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: grid;
  width: min-content;
  grid: auto / auto-flow max-content;
  align-items: center;
  justify-content: center;
  transition: var(--button-transition-duration) ease-in;
  transition-property: background-color, color;
  text-decoration: none;
  border: var(--app-button-border);
  background-color: var(--app-button-bg);
  color: var(--app-button-text);
  font-family: var(--app-font-family-secondary);

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    filter: grayscale(0.75);
    opacity: 0.5;
  }

  &:not([disabled]):focus {
    text-decoration: none;
    transition-timing-function: ease-out;
    color: var(--app-button-text-focus);
    background-color: var(--app-button-bg-focus);
    border: var(--app-button-border-focus);
  }

  &:not([disabled]):hover,
  &:not([disabled]):focus:hover {
    text-decoration: none;
    transition-timing-function: ease-out;
    color: var(--app-button-text-hover);
    background-color: var(--app-button-bg-hover);
    border-color: var(--app-button-border-hover);
    border: var(--app-button-border-hover);
  }

  &:not([disabled]):focus:active {
    text-decoration: none;
    transition-timing-function: ease-out;
    color: var(--app-button-text-active);
    background-color: var(--app-button-bg-active);
    border-color: var(--app-button-border-active);
    border: var(--app-button-border-active);
  }

  /* schemes */
  &--default {
    --app-button-default-bg: transparent;
    --app-button-default-bg-hover: transparent;
    --app-button-default-bg-active: transparent;
    --app-button-default-bg-focus: transparent;

    --app-button-default-text: var(--text-primary-main);
    --app-button-default-text-hover: var(--text-primary-main);
    --app-button-default-text-active: var(--text-primary-main);
    --app-button-default-text-focus: var(--text-primary-main);

    --app-button-default-border: 0;
    --app-button-default-border-hover: 0;
    --app-button-default-border-active: 0;
    --app-button-default-border-focus: 0;

    --app-button-bg: var(--app-button-default-bg);
    --app-button-bg-hover: var(--app-button-default-bg-hover);
    --app-button-bg-active: var(--app-button-default-bg-active);
    --app-button-bg-focus: var(--app-button-default-bg-focus);

    --app-button-text: var(--app-button-default-text);
    --app-button-text-hover: var(--app-button-default-text-hover);
    --app-button-text-active: var(--app-button-default-text-active);
    --app-button-text-focus: var(--app-button-default-text-focus);

    --app-button-border: var(--app-button-default-border);
    --app-button-border-hover: var(--app-button-default-border-hover);
    --app-button-border-active: var(--app-button-default-border-active);
    --app-button-border-focus: var(--app-button-default-border-focus);
  }

  &--filled {
    --app-button-filled-bg: var(--primary-main);
    --app-button-filled-bg-hover: var(--secondary-main);
    --app-button-filled-bg-active: var(--secondary-dark);
    --app-button-filled-bg-focus: var(--primary-main);

    --app-button-filled-text: var(--text-primary-invert-main);
    --app-button-filled-text-hover: var(--text-primary-invert-main);
    --app-button-filled-text-active: var(--text-primary-invert-main);
    --app-button-filled-text-focus: var(--text-primary-invert-main);

    --app-button-filled-border: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-hover: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-active: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-focus: #{toRem(2)} solid var(--secondary-main);

    --app-button-bg: var(--app-button-filled-bg);
    --app-button-bg-hover: var(--app-button-filled-bg-hover);
    --app-button-bg-active: var(--app-button-filled-bg-active);
    --app-button-bg-focus: var(--app-button-filled-bg-focus);

    --app-button-text: var(--app-button-filled-text);
    --app-button-text-hover: var(--app-button-filled-text-hover);
    --app-button-text-active: var(--app-button-filled-text-active);
    --app-button-text-focus: var(--app-button-filled-text-focus);

    --app-button-border: var(--app-button-filled-border);
    --app-button-border-hover: var(--app-button-filled-border-hover);
    --app-button-border-active: var(--app-button-filled-border-active);
    --app-button-border-focus: var(--app-button-filled-border-focus);
  }

  &--flat {
    --app-button-flat-text: var(--text-primary-main);
    --app-button-flat-text-hover: var(--text-primary-dark);
    --app-button-flat-text-active: var(--text-primary-dark);
    --app-button-flat-text-focus: var(--text-primary-main);

    --app-button-flat-border: #{toRem(2)} solid var(--text-primary-light);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-active: var(--app-button-flat-border);
    --app-button-flat-border-focus: var(--app-button-flat-border);

    --app-button-bg: transparent;
    --app-button-bg-hover: transparent;
    --app-button-bg-active: transparent;
    --app-button-bg-focus: transparent;

    --app-button-text: var(--app-button-flat-text);
    --app-button-text-hover: var(--app-button-flat-text-hover);
    --app-button-text-active: var(--app-button-flat-text-active);
    --app-button-text-focus: var(--app-button-flat-text-focus);

    --app-button-border: var(--app-button-flat-border);
    --app-button-border-hover: var(--app-button-flat-border-hover);
    --app-button-border-active: var(--app-button-flat-border-active);
    --app-button-border-focus: var(--app-button-flat-border-focus);
  }

  &--borderless {
    --app-button-borderless-bg: var(--primary-main);
    --app-button-borderless-bg-hover: var(--secondary-main);
    --app-button-borderless-bg-active: var(--secondary-dark);
    --app-button-borderless-bg-focus: var(--secondary-main);

    --app-button-borderless-text: var(--text-primary-invert-main);
    --app-button-borderless-text-hover: var(--text-primary-invert-dark);
    --app-button-borderless-text-active: var(--text-primary-invert-main);
    --app-button-borderless-text-focus: var(--text-primary-invert-dark);

    --app-button-borderless-border: 0;
    --app-button-borderless-border-hover: 0;
    --app-button-borderless-border-active: 0;
    --app-button-borderless-border-focus: 0;

    --app-button-bg: var(--app-button-borderless-bg);
    --app-button-bg-hover: var(--app-button-borderless-bg-hover);
    --app-button-bg-active: var(--app-button-borderless-bg-active);
    --app-button-bg-focus: var(--app-button-borderless-bg-focus);

    --app-button-text: var(--app-button-borderless-text);
    --app-button-text-hover: var(--app-button-borderless-text-hover);
    --app-button-text-active: var(--app-button-borderless-text-active);
    --app-button-text-focus: var(--app-button-borderless-text-focus);

    --app-button-border: var(--app-button-borderless-border);
    --app-button-border-hover: var(--app-button-borderless-border-hover);
    --app-button-border-active: var(--app-button-borderless-border-active);
    --app-button-border-focus: var(--app-button-borderless-border-focus);
  }

  /* colors */
  &--secondary {
    --app-button-default-text: var(--secondary-main);
    --app-button-default-text-hover: var(--text-primary-invert-main);
    --app-button-default-text-active: var(--text-primary-invert-main);
    --app-button-default-text-focus: var(--secondary-main);

    --app-button-flat-text: var(--secondary-main);
    --app-button-flat-text-hover: var(--secondary-main);
    --app-button-flat-text-active: var(--secondary-main);
    --app-button-flat-text-focus: var(--secondary-main);
    --app-button-flat-border: #{toRem(2)} solid var(--secondary-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--secondary-main);
    --app-button-flat-border-active: #{toRem(2)} solid var(--secondary-main);
    --app-button-flat-border-focus: #{toRem(2)} solid var(--secondary-main);

    --app-button-filled-bg: var(--secondary-main);
    --app-button-filled-bg-hover: var(--secondary-main);
    --app-button-filled-bg-active: var(--secondary-dark);
    --app-button-filled-bg-focus: var(--secondary-main);

    --app-button-borderless-text: var(--text-primary-invert-main);
    --app-button-borderless-text-hover: var(--text-primary-invert-main);
    --app-button-borderless-text-active: var(--text-primary-invert-main);
    --app-button-borderless-text-focus: var(--text-primary-invert-main);
    --app-button-borderless-bg: var(--secondary-main);
    --app-button-borderless-bg-hover: var(--secondary-main);
    --app-button-borderless-bg-active: var(--secondary-dark);
    --app-button-borderless-bg-focus: var(--secondary-main);
  }

  &--tertiary {
    --app-button-flat-text: var(--text-primary-main);
    --app-button-flat-text-hover: var(--text-primary-main);
    --app-button-flat-text-active: var(--text-primary-main);
    --app-button-flat-text-focus: var(--text-primary-main);

    $tertiary-border: #{toRem(2)} solid var(--background-secondary);

    --app-button-flat-border: $tertiary-border;
    --app-button-flat-border-hover: $tertiary-border;
    --app-button-flat-border-active: $tertiary-border;
    --app-button-flat-border-focus: $tertiary-border;

    --app-button-filled-bg: var(--background-secondary);
    --app-button-filled-bg-hover: var(--secondary-main);
    --app-button-filled-bg-active: var(--secondary-dark);
    --app-button-filled-bg-focus: var(--background-secondary);
    --app-button-filled-text: var(--text-primary-main);
    --app-button-filled-text-hover: var(--text-primary-invert-main);
    --app-button-filled-text-active: var(--text-primary-invert-main);
    --app-button-filled-text-focus: var(--text-primary-main);
    --app-button-filled-border: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-hover: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-active: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-focus: #{toRem(2)} solid var(--secondary-main);

    --app-button-borderless-text: var(--text-primary-main);
    --app-button-borderless-text-hover: var(--text-primary-invert-main);
    --app-button-borderless-text-active: var(--text-primary-invert-main);
    --app-button-borderless-text-focus: var(--text-primary-main);
    --app-button-borderless-bg: var(--background-primary);
    --app-button-borderless-bg-hover: var(--secondary-main);
    --app-button-borderless-bg-active: var(--secondary-dark);
    --app-button-borderless-bg-focus: var(--background-primary);
  }

  &--success {
    --app-button-flat-text: var(--success-main);
    --app-button-flat-text-hover: var(--success-dark);
    --app-button-flat-text-active: var(--success-dark);
    --app-button-flat-text-focus: var(--success-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--success-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--success-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--success-dark);
    --app-button-flat-border-focus: #{toRem(2)} solid var(--success-dark);

    --app-button-filled-bg: var(--success-main);
    --app-button-filled-bg-hover: var(--success-dark);
    --app-button-filled-bg-active: var(--success-dark);
    --app-button-filled-bg-focus: var(--success-dark);

    --app-button-borderless-bg: var(--success-main);
    --app-button-borderless-bg-hover: var(--success-main);
    --app-button-borderless-bg-active: var(--success-dark);
    --app-button-borderless-bg-focus: var(--success-dark);
  }

  &--error {
    --app-button-flat-text: var(--error-main);
    --app-button-flat-text-hover: var(--error-dark);
    --app-button-flat-text-active: var(--error-dark);
    --app-button-flat-text-focus: var(--error-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--error-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--error-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--error-dark);
    --app-button-flat-border-focus: #{toRem(2)} solid var(--error-dark);

    --app-button-filled-bg: var(--error-main);
    --app-button-filled-bg-hover: var(--error-dark);
    --app-button-filled-bg-active: var(--error-dark);
    --app-button-filled-bg-focus: var(--error-dark);

    --app-button-borderless-bg: var(--error-main);
    --app-button-borderless-bg-hover: var(--error-main);
    --app-button-borderless-bg-active: var(--error-dark);
    --app-button-borderless-bg-focus: var(--error-dark);
  }

  &--warning {
    --app-button-flat-text: var(--warning-main);
    --app-button-flat-text-hover: var(--warning-dark);
    --app-button-flat-text-active: var(--warning-dark);
    --app-button-flat-text-focus: var(--warning-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--warning-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-focus: #{toRem(2)} solid var(--warning-dark);

    --app-button-filled-bg: var(--warning-main);
    --app-button-filled-bg-hover: var(--warning-dark);
    --app-button-filled-bg-active: var(--warning-dark);
    --app-button-filled-bg-focus: var(--warning-dark);

    --app-button-borderless-bg: var(--warning-main);
    --app-button-borderless-bg-hover: var(--warning-main);
    --app-button-borderless-bg-active: var(--warning-dark);
    --app-button-borderless-bg-focus: var(--warning-dark);
  }

  &--info {
    --app-button-flat-text: var(--info-main);
    --app-button-flat-text-hover: var(--info-dark);
    --app-button-flat-text-active: var(--info-dark);
    --app-button-flat-text-focus: var(--info-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--info-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--info-dark);
    --app-button-flat-border-focus: #{toRem(2)} solid var(--info-dark);

    --app-button-filled-bg: var(--info-main);
    --app-button-filled-bg-hover: var(--info-dark);
    --app-button-filled-bg-active: var(--info-dark);
    --app-button-filled-bg-focus: var(--info-dark);

    --app-button-borderless-bg: var(--info-main);
    --app-button-borderless-bg-hover: var(--info-main);
    --app-button-borderless-bg-active: var(--info-dark);
    --app-button-borderless-bg-focus: var(--info-dark);
  }

  /* modifications */
  &--border-circle {
    border-radius: toRem(50);
  }

  &--border-rounded {
    border-radius: toRem(10);
  }

  /* sizes */
  &--large {
    padding: toRem(24) toRem(50);
    grid-gap: toRem(16);
    font-weight: 700;
    font-size: toRem(20);
  }

  &--medium {
    padding: toRem(16) toRem(32);
    font-size: toRem(16);
    line-height: 1.4;
    font-weight: 600;
    grid-gap: toRem(12);
    letter-spacing: 0;
  }

  &--small {
    font-size: toRem(16);
    line-height: 1;
    letter-spacing: 0.1em;
    font-weight: 700;
    padding: toRem(12) toRem(24);
    grid-gap: toRem(8);
  }

  .app-button__icon-left,
  .app-button__icon-right {
    color: inherit;
    height: 1.2em;
    width: 1.2em;
  }
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;

  @include text-ellipsis;
}
</style>
