<script lang="ts" setup>
import { AppBlock, AppButton } from '@/common'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const postId = computed(() => route.params.id)
</script>

<template>
  <div class="post-item-page">
    <app-block class="post-item-page__banner-wrp">
      <div
        class="post-item-page__banner"
        style="
          background-image: url('https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
        "
      >
        <div class="post-item-page__banner-title-wrp">
          <h1 class="post-item-page__banner-title">
            {{ 'Tokens' }}
          </h1>
          <app-button
            class="post-item-page__back-btn"
            :icon-left="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
          />
        </div>
      </div>
    </app-block>
    <app-block class="post-item-page__content-wrp">
      <div class="post-item-page__content">
        <h4 class="post-item-page__title">Title 1</h4>
        <p>
          DESCRIPTION Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book.
        </p>
        <p>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </p>
        <h4 class="post-item-page__title">Title 2</h4>
        <img
          class="post-item-page__img"
          src="https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt=""
        />
        <p>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </p>
        <p>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </p>
        <h4 class="post-item-page__title post-item-page__title--accent">
          Title 2
        </h4>
        <img
          class="post-item-page__img"
          src="https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt=""
        />
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
$page-padding-left: toRem(165);
$page-padding-right: toRem(165);

.post-item-page {
  display: flex;
  flex-direction: column;
}

.post-item-page__banner-wrp {
}

.post-item-page__banner {
  background-size: cover;
  background-position: center;
  min-height: toRem(200);
  padding: toRem(50) $page-padding-right toRem(60) $page-padding-left;
}

.post-item-page__banner-title-wrp {
  position: relative;
}

.post-item-page__banner-title {
  font-size: toRem(70);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-primary-invert-main);
}

.post-item-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;
}

.post-item-page__content-wrp {
  flex: 1;
}

.post-item-page__content {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  padding: toRem(70) $page-padding-right toRem(40) $page-padding-left;

  p {
    font-size: toRem(20);
    line-height: 1.3;
    letter-spacing: 0.1em;
  }
}

.post-item-page__title {
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary-main);

  &--accent {
    font-size: toRem(36);
    font-weight: 900;
  }
}

.post-item-page__img {
  max-width: 80%;
  height: auto;
  margin: 0 auto;
}
</style>
