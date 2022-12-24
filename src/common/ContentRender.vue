<script lang="ts" setup>
import { Icon } from '@/common'
import { Post } from '@/types'
defineProps<{
  content: Post['content']
}>()
</script>

<template>
  <div class="content-render">
    <template v-for="([key, value], idx) in content">
      <template v-if="key === 'title'">
        <h4 class="content-render__title" :key="idx">
          {{ value }}
        </h4>
      </template>
      <template v-else-if="key === 'title-accent'">
        <h4
          class="content-render__title content-render__title--accent"
          :key="idx"
        >
          {{ value }}
        </h4>
      </template>
      <template v-else-if="key === 'subtitle-accented'">
        <h5 class="content-render__subtitle-accented" :key="idx">
          {{ value }}
        </h5>
      </template>
      <template v-else-if="key === 'subtitle-low'">
        <h5
          class="content-render__subtitle content-render__subtitle--low"
          :key="idx"
        >
          {{ value }}
        </h5>
      </template>
      <template v-else-if="key === 'subtitle'">
        <h5 class="content-render__subtitle" :key="idx">
          {{ value }}
        </h5>
      </template>
      <template v-else-if="key === 'paragraph'">
        <!-- eslint-disable vue/no-v-html -->
        <p :key="idx" class="content-render__paragraph" v-html="value" />
      </template>
      <template v-else-if="key === 'paragraph-16'">
        <!-- eslint-disable vue/no-v-html -->
        <p :key="idx" class="content-render__paragraph--small" v-html="value" />
      </template>
      <template v-else-if="key === 'paragraph-secondary'">
        <p
          :key="idx"
          class="content-render__paragraph-secondary"
          v-html="value"
        />
      </template>
      <template v-else-if="key === 'image'">
        <img :key="idx" class="content-render__img" :src="value" alt="" />
      </template>
      <template v-else-if="key === 'image-links'">
        <div :key="idx" class="content-render__img-links">
          <a
            v-for="(link, ind) of value"
            :key="ind"
            class="content-render__img-links-item"
            target="_blank"
            :href="link"
          >
            <!-- https://www.google.com/search?q=smth -> google.com -->
            {{ link.split(/\/+/)[1] }}
            <icon
              class="content-render__img-links-icon"
              :name="$icons.externalLink"
            />
          </a>
        </div>
      </template>
      <template
        v-else-if="key === 'unordered-list' || key === 'unordered-list-16'"
      >
        <ul
          :key="idx"
          class="content-render__unordered-list"
          :class="{
            'content-render__unordered-list--small':
              key === 'unordered-list-16',
          }"
        >
          <li
            v-for="(item, ind) of value"
            :key="ind"
            class="content-render__unordered-list-item"
          >
            <icon
              class="content-render__unordered-list-icon"
              :name="$icons.circleFilled"
            />
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="content-render__unordered-list-text" v-html="item" />
          </li>
        </ul>
      </template>
      <template v-else-if="key === 'code-row'">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p :key="idx" class="content-render__code-row" v-html="value" />
      </template>
    </template>
  </div>
</template>

<style lang="scss">
/* stylelint-disable declaration-no-important */
$page-padding-left: toRem(165);
$page-padding-right: toRem(165);

.content-render {
  display: flex;
  flex-direction: column;

  & a {
    color: var(--secondary-main);
    font-size: 1em;
    font-weight: 400;
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: toRem(1);
      background-color: var(--secondary-main);
      position: absolute;
      left: 0;
      bottom: toRem(1);
    }
  }

  & > :first-child {
    padding-top: 0;
  }
}

.content-render__accented {
  color: var(--secondary-main);
  font-size: 1em;
}

.content-render__bold {
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__consolas {
  font-family: var(--app-font-family-tertiary);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__unordered-list {
  padding-top: toRem(30);
  padding-left: toRem(30);
}

.content-render__paragraph {
  padding-top: toRem(30);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  word-break: break-word;

  & + .content-render__unordered-list {
    padding-top: toRem(15);
  }

  &--small {
    padding-top: toRem(30);
    font-size: toRem(16);
    line-height: 1.3;
    letter-spacing: 0.1em;
    word-break: break-word;
  }

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__paragraph-secondary {
  padding-top: toRem(30);
  color: var(--text-secondary-main);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__code-row {
  padding-top: toRem(30);
  font-family: var(--app-font-family-tertiary);
  color: var(--text-secondary-main);
  font-weight: 700;
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__title {
  padding-top: toRem(30);
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary-main);

  @include respond-to(medium) {
    font-size: toRem(20);
  }

  &--accent {
    font-size: toRem(36);
    font-weight: 900;

    @include respond-to(medium) {
      font-size: toRem(24);
    }
  }
}

.content-render__subtitle {
  padding-top: toRem(30);
  font-size: toRem(26);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary-main);

  &--low {
    font-size: toRem(20);

    @include respond-to(medium) {
      font-size: toRem(18);
    }
  }
}

.content-render__subtitle-accented {
  padding-top: toRem(30);
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--secondary-main);
}

.content-render__img {
  padding-top: toRem(30);
  max-width: 80%;
  height: auto;
  margin: 0 auto;
}

.content-render__img-links {
  padding-top: toRem(30);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: toRem(35);

  @include respond-to(medium) {
    flex-direction: column;
  }
}

a.content-render__img-links-item {
  display: flex;
  align-items: center;
  gap: toRem(10);
  color: var(--secondary-main);
  font-size: toRem(16);
  font-weight: 700;

  &:after {
    height: 0;
  }
}

.content-render__img-links-icon {
  color: var(--text-primary-main);
  max-width: toRem(12) !important;
  max-height: toRem(12) !important;
  min-width: toRem(12);
  min-height: toRem(12);
}

.content-render__unordered-list-item {
  display: flex;
  align-items: center;
  position: relative;
}

.content-render__unordered-list-text {
  font-size: toRem(20);
  line-height: toRem(26);

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.content-render__unordered-list-icon {
  max-width: toRem(3) !important;
  max-height: toRem(3) !important;
  min-width: toRem(3);
  min-height: toRem(3);
  position: absolute;
  top: toRem(11);
  left: -#{toRem(16)};
}

.content-render__unordered-list--small {
  .content-render__unordered-list-text {
    font-size: toRem(16);
    line-height: 1.3;
    letter-spacing: 0.1em;
    word-break: break-word;
  }
}
</style>
