<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { AppBlock, AppButton } from '@/common'
import { CATEGORIES_IDS, PRODUCT_IDS, WINDOW_BREAKPOINTS } from '@/enums'
import ImgMainTitle from '/static/images/MainTitle.png'
import ImgMainTitleMobile from '/static/images/MainTitleMobile.png'
import ImgMainPage1 from '/static/images/MainPage_1.png'
import ImgMainPage1Mobile from '/static/images/MainPage_1Mobile.png'

const router = useRouter()
const { width: windowWidth } = useWindowSize()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.medium)
const isMobile = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>

<template>
  <div class="main-page">
    <img
      class="main-page__title-img"
      :src="isMobile ? ImgMainTitleMobile : ImgMainTitle"
    />
    <div class="main-page__content">
      <div class="main-page__rows">
        <div class="main-page__row">
          <app-block class="main-page__row-block">
            <div class="main-page__row-block-inner">
              <span class="main-page__row-title">
                {{ $t('main-page.first-block-title') }}
              </span>
              <span class="main-page__row-description">
                {{ $t('main-page.first-block-description') }}
              </span>
              <app-button
                class="main-page__row-button"
                :text="$t('main-page.first-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.categories,
                    params: { id: CATEGORIES_IDS.tokens },
                  })
                "
              />
            </div>
          </app-block>
          <img
            class="main-page__row-img"
            :src="isTablet ? ImgMainPage1Mobile : ImgMainPage1"
          />
        </div>
        <div class="main-page__row main-page__row--inverted">
          <app-block class="main-page__row-block">
            <div class="main-page__row-block-inner">
              <span class="main-page__row-title">
                {{ $t('main-page.second-block-title') }}
              </span>
              <span class="main-page__row-description">
                {{ $t('main-page.second-block-description') }}
              </span>
              <app-button
                class="main-page__row-button"
                :text="$t('main-page.second-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.product,
                    params: { id: PRODUCT_IDS.ERC20 },
                  })
                "
              />
            </div>
          </app-block>
          <img class="main-page__row-img" src="/static/images/MainPage_2.png" />
        </div>
        <div class="main-page__row">
          <app-block class="main-page__row-block">
            <div class="main-page__row-block-inner">
              <span class="main-page__row-title">
                {{ $t('main-page.third-block-title') }}
              </span>
              <span class="main-page__row-description">
                {{ $t('main-page.third-block-description') }}
              </span>
              <app-button
                class="main-page__row-button"
                :text="$t('main-page.third-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.product,
                    params: { id: PRODUCT_IDS.ERC721 },
                  })
                "
              />
            </div>
          </app-block>
          <img
            class="main-page__row-img main-page__row-img--mobile-up"
            src="/static/images/MainPage_3.png"
          />
        </div>
        <div class="main-page__row main-page__row--inverted">
          <div class="main-page__row-block">
            <div class="main-page__row-block-inner">
              <span class="main-page__row-title">
                {{ $t('main-page.fourth-block-title') }}
              </span>
              <span class="main-page__row-description">
                {{ $t('main-page.fourth-block-description') }}
              </span>
              <app-button
                class="main-page__row-button"
                :text="$t('main-page.fourth-block-btn')"
                size="small"
                :href="'https://distributedlab.com/'"
              />
            </div>
          </div>
          <img
            class="main-page__row-img main-page__row-img--low-translate"
            src="/static/images/MainPage_4.png"
          />
        </div>
      </div>
      <div class="main-page__people">
        <app-block>
          <div class="main-page__people-item">
            <img
              class="main-page__people-img"
              src="/static/images/MainPage_People1.png"
            />
            <div class="main-page__people-description">
              <div class="main-page__people-title">
                <div class="main-page__people-name">
                  {{ $t('main-page.first-people-name') }}
                </div>
                <div class="main-page__people-surname">
                  {{ $t('main-page.first-people-surname') }}
                </div>
              </div>
              <div class="main-page__people-subtitle">
                {{ $t('main-page.first-people-subtitle') }}
              </div>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="main-page__people-item">
            <img
              class="main-page__people-img"
              src="/static/images/MainPage_People2.png"
            />
            <div class="main-page__people-description">
              <div class="main-page__people-title">
                <div class="main-page__people-name">
                  {{ $t('main-page.second-people-name') }}
                </div>
                <div class="main-page__people-surname">
                  {{ $t('main-page.second-people-surname') }}
                </div>
              </div>
              <div class="main-page__people-subtitle">
                {{ $t('main-page.second-people-subtitle') }}
              </div>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="main-page__people-item">
            <img
              class="main-page__people-img"
              src="/static/images/MainPage_People3.png"
            />
            <div class="main-page__people-description">
              <div class="main-page__people-title">
                <div class="main-page__people-name">
                  {{ $t('main-page.third-people-name') }}
                </div>
                <div class="main-page__people-surname">
                  {{ $t('main-page.third-people-surname') }}
                </div>
              </div>
              <div class="main-page__people-subtitle">
                {{ $t('main-page.third-people-subtitle') }}
              </div>
            </div>
          </div>
        </app-block>
      </div>
      <span class="main-page__under-people-description">
        {{ $t('main-page.people-description') }}
      </span>
      <img class="main-page__sphere-logo" src="/static/images/MainPage_5.svg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page__title-img {
  width: 100%;
}

.main-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(70);
}

.main-page__row-block-inner {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  padding: toRem(40) toRem(70);

  @include respond-to(xmedium) {
    padding: toRem(40) toRem(60);
  }

  @include respond-to(small) {
    padding: toRem(40) toRem(30);
  }
}

.main-page__row-img {
  transform: translateX(-#{toRem(125)});

  @include respond-to(medium) {
    width: 100%;
    transform: translate(0, 25%);

    &--mobile-up {
      transform: translateY(15%);
    }
  }
}

.main-page__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &--inverted {
    flex-direction: row-reverse;

    .main-page__row-block-inner {
      align-items: end;
      text-align: end;

      @include respond-to(medium) {
        align-items: start;
        text-align: start;
      }
    }

    .main-page__row-img {
      transform: translateX(25%);

      @include respond-to(medium) {
        transform: translate(0, 17.5%);
      }

      &--low-translate {
        transform: translateX(10%);

        @include respond-to(medium) {
          padding-top: toRem(70);
        }
      }
    }
  }

  @include respond-to(medium) {
    flex-direction: column-reverse;
  }
}

.main-page__row-block {
  max-width: toRem(1125);
  width: 100%;
}

.main-page__row-title {
  font-family: var(--app-font-family-secondary);
  font-weight: 900;
  font-size: toRem(70);

  @include respond-to(medium) {
    font-size: toRem(36);
  }
}

$description-z-index: 5;

.main-page__row-description {
  font-size: toRem(20);
  line-height: toRem(26);
  z-index: $description-z-index;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.main-page__row-button {
  @include respond-to(medium) {
    width: 100%;
  }
}

.main-page__people {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @include respond-to(xmedium) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
}

.main-page__people-item {
  display: flex;
  flex-direction: column;
  gap: toRem(40);
  padding: toRem(40) toRem(46);

  @include respond-to(small) {
    padding: toRem(40) toRem(20);
  }
}

.main-page__people-img {
  @include respond-to(large) {
    width: 100%;
  }
}

.main-page__people-description {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(10);
}

.main-page__people-title {
  font-family: var(--app-font-family-secondary);
  font-size: toRem(36);
  font-weight: 900;
  letter-spacing: 0.1em;
  text-align: center;
  word-spacing: toRem(99999);

  @include respond-to(xmedium) {
    font-size: toRem(30);
    font-weight: 700;
    word-spacing: normal;
  }
}

.main-page__under-people-description {
  max-width: toRem(990);
  text-align: center;
  font-size: toRem(20);
  line-height: toRem(26);

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.main-page__sphere-logo {
  max-width: toRem(375);
  width: 100%;
  padding: 0 toRem(40);
}
</style>
