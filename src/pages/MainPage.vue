<script lang="ts" setup>
import { ref } from 'vue'

import { AppBlock, AppButton } from '@/common'
import ProductCard from '@/pages/MainPage/ProductCard.vue'

const countOfCards = ref<number>(3)

const productCards = [
  {
    id: 'erc20-base',
    imgPosition: 'right bottom',
  },
  {
    id: 'erc721-base',
    imgPosition: 'left bottom',
  },
  {
    id: 'erc20-mint',
    imgPosition: 'right top',
  },
  {
    id: 'erc20-burn',
    imgPosition: 'left bottom',
  },
  {
    id: 'erc721-burn',
    imgPosition: '25% 75%',
  },
  {
    id: 'erc721-enum',
    imgPosition: 'right top',
  },
  {
    id: 'erc20-mint-cap',
    imgPosition: 'left top',
  },
  {
    id: 'erc20-mint-burn',
    imgPosition: 'center',
  },
  {
    id: 'erc721-burn-enum',
    imgPosition: 'right bottom',
  },
  {
    id: 'erc20-mint-burn-cap',
    imgPosition: '25% 75%',
  },
]

const instruction = [
  [
    [
      'text',
      'To start working with Dapppad, connect your MetaMask wallet and switch to Goerli test network',
    ],
    ['img', '/images/MainPageInstruction_1.png'],
  ],
  [
    [
      'text',
      'Choose the product you want to deploy, accept the current price and press “Deploy now”',
    ],
    ['img', '/images/MainPageInstruction_2.png'],
  ],
  [
    [
      'text',
      'Choose payment token and define product deployment parameters then press "Deploy"',
    ],
    ['img', '/images/MainPageInstruction_3.png'],
    [
      'text',
      'For Goerli test net you can mint payment token if you don’t have one. This option will be available after selecting a payment token.',
    ],
    ['img', '/images/MainPageInstruction_3-2.png'],
  ],
  [
    ['text', 'Wait while “Transaction processing...”'],
    ['img', '/images/MainPageInstruction_4.png'],
    [
      'text',
      'Your product is deployed on blockchain and payment is withdrawn from your address. You were also given a certain amount of DAPP token.',
    ],
    ['img', '/images/MainPageInstruction_4-2.png'],
    [
      'text',
      'You may close the window or press “Go to edit" to interact with the product.',
    ],
  ],
  [
    [
      'text',
      'After “Go to edit” in “Editing” you may, for example, send "Approve" or "Transfer" transaction token transactions or make any other allowed product modification and use.',
    ],
    ['img', '/images/MainPageInstruction_5.png'],
  ],
  [
    [
      'text',
      'For each product purchase you are eligible and receive DAPP tokens',
    ],
    ['img', '/images/MainPageInstruction_6.png'],
    [
      'text',
      '1 DAPP token is equal to 1 USD spent on cashback distributed to previous buyers. And you can also stake DAPP tokens and receive cashback from each next product purchase on Dapppad. Press the “Cashback” button',
    ],
    ['img', '/images/MainPageInstruction_6-2.png'],
  ],
  [
    [
      'text',
      'Press “STAKE” and stake your DAPP token current balance and approve staking transaction in MetaMask',
    ],
    ['img', '/images/MainPageInstruction_7.png'],
  ],
  [
    [
      'text',
      'After each next purchase by anyone else on Dapppad you are eligible to receive cashback rewards on your staked DAPP tokens and may claim these rewards by clicking “Claim” button',
    ],
    ['img', '/images/MainPageInstruction_8.png'],
  ],
  [
    [
      'link',
      'The more you buy on Dapppad the more DAPP tokens you receive. The more DAPP tokens you receive and stake the more cashbacks from future Dapppad sales you receive. You may always withdraw the DAPP token from staking on Cashback page <a class="main-page__instruction-block-link" href="cashback">here</a>.',
    ],
    ['img', '/images/MainPageInstruction_9.png'],
  ],
]

const handleShowMore = () => {
  countOfCards.value += 3

  if (countOfCards.value > productCards.length)
    countOfCards.value = productCards.length
}

const handleShowLess = () => {
  if (
    countOfCards.value === productCards.length &&
    productCards.length % 3 !== 0
  )
    countOfCards.value -= productCards.length % 3
  else countOfCards.value -= 3

  if (countOfCards.value < 3) countOfCards.value = 3
}
</script>

<template>
  <div class="main-page">
    <img
      src="/images/MainPageAdditional_1.png"
      class="main-page__additional-img main-page__additional-img--first"
    />
    <img
      src="/images/MainPageAdditional_2.png"
      class="main-page__additional-img main-page__additional-img--second"
    />
    <img
      src="/images/MainPageAdditional_3.png"
      class="main-page__additional-img main-page__additional-img--third"
    />
    <img
      src="/images/MainPageAdditional_4.png"
      class="main-page__additional-img main-page__additional-img--fourth"
    />
    <h1 class="app__module-title main-page__heading">
      {{ $t('main-page.our-products') }}
    </h1>
    <div class="main-page__product-cards">
      <div class="main-page__product-card-wrp">
        <app-block
          v-for="card in productCards.slice(0, countOfCards)"
          :key="card.id"
        >
          <product-card :data="card" />
        </app-block>
      </div>
      <div class="main-page__product-buttons">
        <app-button
          v-if="countOfCards !== 3"
          class="main-page__product-btn"
          color="tertiary"
          size="large"
          :text="$t('main-page.show-less-btn')"
          @click="handleShowLess"
        />
        <app-button
          v-if="countOfCards !== productCards.length"
          class="main-page__product-btn"
          color="tertiary"
          size="large"
          :text="$t('main-page.show-more-btn')"
          @click="handleShowMore"
        />
      </div>
    </div>
    <h1 class="app__module-title main-page__heading">
      {{ $t('main-page.instruction-lbl') }}
    </h1>
    <div class="main-page__instruction">
      <app-block
        class="main-page__instruction-block-wrp"
        v-for="(block, blockInd) in instruction"
        :key="blockInd"
      >
        <div class="main-page__instruction-block">
          <div
            class="main-page__instruction-block-row"
            v-for="(row, rowInd) in block"
            :key="rowInd"
          >
            <div
              class="main-page__instruction-block-number"
              v-if="rowInd === 0"
            >
              {{ blockInd + 1 }}
            </div>
            <div
              v-if="row[0] === 'text'"
              class="main-page__instruction-block-row-text"
            >
              {{ row[1] }}
            </div>
            <!-- eslint-disable -->
            <div
              v-else-if="row[0] === 'link'"
              class="main-page__instruction-block-row-text"
              v-html="row[1]"
            />
            <!-- eslint-enable -->
            <img
              v-else-if="row[0] === 'img'"
              class="main-page__instruction-block-row-image"
              :src="row[1]"
            />
          </div>
        </div>
      </app-block>
    </div>
    <img class="main-page__logo" src="/images/MainPageLogo.svg" alt="" />
  </div>
</template>

<style lang="scss">
$z-index: 1;

.main-page {
  display: flex;
  flex-direction: column;
}

.main-page__heading {
  padding: toRem(50) 0;
  z-index: $z-index;
}

.main-page__product-cards {
  display: flex;
  flex-direction: column;
  gap: toRem(36);
  align-items: center;
  padding-bottom: toRem(50);
  z-index: $z-index;
}

.main-page__product-card-wrp {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;

  @include respond-to(medium) {
    grid-template-columns: 1fr;
  }
}

.main-page__product-buttons {
  display: flex;
  gap: toRem(40);

  @include respond-to(medium) {
    flex-direction: column;
    width: 100%;
    gap: toRem(24);
  }
}

.main-page__product-btn {
  width: toRem(400);
  padding: toRem(16) 0;

  @include respond-to(medium) {
    width: 100%;
  }
}

.main-page__instruction {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  z-index: $z-index;

  @include respond-to(medium) {
    grid-template-columns: 1fr;
  }
}

.main-page__instruction-block {
  padding: toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.main-page__instruction-block-row-text {
  width: 100%;
  padding-top: toRem(8);
  line-height: 1.3;
}

.main-page__instruction-block-wrp {
  &:last-child:nth-child(2n + 1) {
    grid-column: 1 / -1;

    .main-page__instruction-block {
      flex-direction: row;
      gap: toRem(200);

      .main-page__instruction-block-row-text {
        max-width: toRem(485);
        align-self: start;
      }

      @include respond-to(medium) {
        flex-direction: column;
        gap: toRem(20);
      }
    }
  }
}

.main-page__instruction-block-row {
  display: flex;
  gap: toRem(16);
  align-items: center;
  justify-content: center;
}

.main-page__instruction-block-number {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: start;
  min-width: toRem(50);
  min-height: toRem(50);
  max-width: toRem(50);
  max-height: toRem(50);
  background-color: var(--primary-main);
  color: var(--text-primary-invert-main);
  font-size: toRem(30);
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
}

.main-page__instruction-block-row-image {
  max-width: 80%;

  @include respond-to(medium) {
    width: 100%;
    max-width: 100%;
  }
}

.main-page__instruction-block-link {
  color: var(--secondary-main);
  font-weight: 400;
  text-decoration: underline;
}

.main-page__logo {
  width: 100%;
  max-width: toRem(300);
  padding: toRem(75) 0;
  align-self: center;
}

.main-page__additional-img {
  position: absolute;

  &--first {
    right: 0;
    opacity: 0.5;
    filter: blur(#{toRem(5)});
  }

  &--second {
    left: 0;
    top: toRem(770);
  }

  &--third {
    right: 0;
    top: toRem(1270);
    opacity: 0.5;
    filter: blur(#{toRem(5)});
  }

  &--fourth {
    right: 0;
    top: toRem(3300);
  }
}
</style>
