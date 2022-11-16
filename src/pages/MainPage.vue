<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { AppBlock, AppButton } from '@/common'

const router = useRouter()

const redirect = (link: string) => {
  window.location.href = link
}
</script>

<template>
  <div class="main-page">
    <img class="main-page__title-img" src="static/images/MainTitle.svg" />
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
                :text="$t('main-page.first-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.categories,
                    params: { id: `tokens` },
                  })
                "
              />
            </div>
          </app-block>
          <img class="main-page__row-img" src="static/images/MainPage_1.png" />
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
                :text="$t('main-page.second-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.product,
                    params: { id: `erc20` },
                  })
                "
              />
            </div>
          </app-block>
          <img class="main-page__row-img" src="static/images/MainPage_2.png" />
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
                :text="$t('main-page.third-block-btn')"
                size="small"
                @click="
                  router.push({
                    name: $routes.product,
                    params: { id: `erc721` },
                  })
                "
              />
            </div>
          </app-block>
          <img class="main-page__row-img" src="static/images/MainPage_3.png" />
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
                :text="$t('main-page.fourth-block-btn')"
                size="small"
                @click="redirect('https://distributedlab.com/')"
              />
            </div>
          </div>
          <img
            class="main-page__row-img main-page__row-img--low-translate"
            src="static/images/MainPage_4.png"
          />
        </div>
      </div>
      <div class="main-page__people">
        <app-block>
          <div class="main-page__people-item">
            <img
              class="main-page__people-img"
              src="static/images/MainPage_People1.png"
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
              src="static/images/MainPage_People2.png"
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
              src="static/images/MainPage_People3.png"
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
      <img src="static/images/MainPage_5.svg" />
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
}

.main-page__row-img {
  transform: translateX(-#{toRem(125)});
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
    }

    .main-page__row-img {
      transform: translateX(25%);

      &--low-translate {
        transform: translateX(10%);
      }
    }
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
}

.main-page__row-description {
  font-size: toRem(20);
  line-height: toRem(26);
}

.main-page__people {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.main-page__people-item {
  display: flex;
  flex-direction: column;
  gap: toRem(40);
  padding: toRem(40) toRem(46);
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
}

.main-page__under-people-description {
  max-width: toRem(990);
  text-align: center;
  font-size: toRem(20);
  line-height: toRem(26);
}
</style>
