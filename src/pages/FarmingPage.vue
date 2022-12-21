<script lang="ts" setup>
import { ref, watch, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import { AppButton, Icon, AppBlock, Modal, LinkCopy, Loader } from '@/common'
import { InputField } from '@/fields'
import { getMaxUint256, txWrapper } from '@/helpers'
import { formatAmount } from '@/helpers'
import { ICON_NAMES } from '@/enums'
import { i18n } from '@/localization'
import {
  useErc20,
  useFarming,
  InvestInfo,
  useFormValidation,
} from '@/composables'
import { required, numeric } from '@/validators'
import { BN } from '@/utils'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())
const { t } = i18n.global

const farming = useFarming()
const investmentToken = useErc20()
const rewardToken = useErc20()

const isModalStakingShown = ref(false)
const isModalWithdrawingShown = ref(false)
const isModalClaimingShown = ref(false)

const investmentBalance = ref('0')
const investInfo = ref<InvestInfo>({
  amount: '0',
  rewards: '0',
})

const rewardBalance = ref('0')
const isLoaded = ref(false)

const stakingForm = reactive({ amount: '' })
const stakingValidation = useFormValidation(stakingForm, {
  amount: { required, numeric },
})

const withdrawForm = reactive({ amount: '' })
const withdrawValidation = useFormValidation(withdrawForm, {
  amount: { required, numeric },
})

const init = async () => {
  await farming.loadDetails()

  investmentToken.init(farming.investmentToken.value)
  rewardToken.init(farming.rewardToken.value)
  await Promise.all([investmentToken.loadDetails(), rewardToken.loadDetails()])

  await updateBalanceState()

  isLoaded.value = true
}

const isClaimAvailable = computed(() =>
  investInfo.value?.rewards
    ? new BN(investInfo.value?.rewards).compare(0) === 1
    : false,
)

const isWithdrawAvailable = computed(() =>
  investInfo.value.amount
    ? new BN(investInfo.value?.amount).compare(0) === 1
    : false,
)

const isDappBalanceEmpty = computed(
  () => !Number(formatAmount(account.value.dappBalance)),
)

const updateBalanceState = async () => {
  if (!provider.value.selectedAddress) return

  const [
    accountInvestInfo,
    reward,
    investmnetBalanceAmount,
    rewardBalanceAmount,
  ] = await Promise.all([
    farming.accountInvestInfo(provider.value.selectedAddress),
    farming.getRewards(provider.value.selectedAddress),
    investmentToken.balanceOf(provider.value.selectedAddress),
    rewardToken.balanceOf(provider.value.selectedAddress),
    farming.loadDetails(),
    account.value.updateDappBalance(),
  ])

  investInfo.value.amount = accountInvestInfo.amount
  investInfo.value.rewards = reward
  investmentBalance.value = investmnetBalanceAmount
  rewardBalance.value = rewardBalanceAmount
}

const clickMaxStakingAmount = () => {
  stakingForm.amount = new BN(investmentBalance.value)
    .fromFraction(investmentToken.decimals.value)
    .toString()
}

const clickMaxWithdrawAmount = () => {
  withdrawForm.amount = new BN(investInfo.value.amount)
    .fromFraction(investmentToken.decimals.value)
    .toString()
}

const submitClaim = async () => {
  if (!provider.value.selectedAddress) return

  await txWrapper(farming.claim, { account: provider.value.selectedAddress })
  await updateBalanceState()

  isModalClaimingShown.value = false
}

const submitStaking = async () => {
  if (!provider.value.selectedAddress) return

  const amount = new BN(stakingForm.amount)
    .toFraction(investmentToken.decimals.value)
    .toString()

  const allowance = await investmentToken.allowance(
    provider.value.selectedAddress,
    farming.address.value,
  )

  if (new BN(allowance).compare(amount) < 0) {
    await txWrapper(investmentToken.approve, {
      spender: farming.address.value,
      amount: getMaxUint256(),
    })
  }

  await txWrapper(farming.invest, { amount })
  await updateBalanceState()

  isModalStakingShown.value = false
}

const submitWithdraw = async () => {
  if (!provider.value.selectedAddress) return

  const amount = new BN(withdrawForm.amount)
    .toFraction(investmentToken.decimals.value)
    .toString()

  await txWrapper(farming.withdraw, {
    amount,
    receiver: provider.value.selectedAddress,
  })
  await updateBalanceState()

  isModalWithdrawingShown.value = false
}

watch(
  () => provider.value.selectedAddress,
  () => {
    updateBalanceState()
  },
)

init()
</script>

<template>
  <div class="farming-page">
    <div class="farming-page__content">
      <div class="app__module-heading">
        <div class="app__module-title-wrp">
          <app-button
            class="app__module-back-btn"
            :icon-left="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
            :route="{ name: $routes.main }"
          />
          <div class="app__module-title">
            {{ $t('farming-page.title') }}
          </div>
        </div>
        <link-copy
          class="app__link--secondary app__module-subtitle"
          :address="farming.address.value"
        />
        <div class="app__module-description">
          {{ $t('farming-page.subtitle') }}
        </div>
      </div>
      <div class="farming-page__tables">
        <div class="farming-page__table-wrp">
          <div class="farming-page__table">
            <app-block class="farming-page__table-block">
              <div class="farming-page__table-item">
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon farming-page__dark-icon"
                    :name="ICON_NAMES.circleFilled"
                  />
                  <i18n-t keypath="farming-page.balance-lbl" tag="span">
                    <template #curr>
                      {{ investmentToken.symbol.value }}
                    </template>
                  </i18n-t>
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(
                          account.dappBalance,
                          investmentToken?.decimals.value,
                        )
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ investmentToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <app-block class="farming-page__table-block">
              <div class="farming-page__table-item">
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon"
                    :name="ICON_NAMES.coins"
                  />
                  {{ t('farming-page.total-stake-lbl') }}
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(
                          farming.totalInvestedAmount.value,
                          investmentToken.decimals.value,
                        )
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ investmentToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <app-block class="farming-page__table-block">
              <div class="farming-page__table-item">
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon"
                    :name="ICON_NAMES.coin"
                  />
                  {{ t('farming-page.my-stake-lbl') }}
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(
                          investInfo.amount,
                          investmentToken.decimals.value,
                        )
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ investmentToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <app-block class="farming-page__table-block">
              <div
                class="farming-page__table-buttons"
                :class="{
                  'farming-page__table-buttons--no-withdraw':
                    !isWithdrawAvailable || !isLoaded,
                }"
              >
                <app-button
                  v-if="isWithdrawAvailable && isLoaded"
                  class="farming-page__table-btn farming-page__table-btn--white"
                  :text="t('farming-page.withdraw-btn')"
                  size="large"
                  color="tertiary"
                  scheme="borderless"
                  modification="border-rounded"
                  @click="isModalWithdrawingShown = true"
                />
                <app-button
                  class="farming-page__table-btn"
                  :text="t('farming-page.stake-btn')"
                  :disabled="isDappBalanceEmpty"
                  size="large"
                  scheme="borderless"
                  modification="border-rounded"
                  @click="isModalStakingShown = true"
                />
              </div>
            </app-block>
          </div>
          <div class="farming-page__token-info-wrp">
            <div class="farming-page__token-info">
              <template v-if="isLoaded">
                <span class="farming-page__table-desc-text">
                  {{
                    `${$t('farming-page.stake-address-lbl')} (${
                      investmentToken.symbol.value
                    })`
                  }}
                </span>
                <link-copy
                  class="app__link--accented farming-page__table-desc-address"
                  :address="investmentToken.address.value"
                />
              </template>
              <loader v-else />
            </div>
          </div>
        </div>
        <div class="farming-page__table-wrp">
          <div
            class="farming-page__table"
            :class="{
              'farming-page__claim-not-available':
                !isClaimAvailable || !isLoaded,
            }"
          >
            <app-block class="farming-page__table-block">
              <div class="farming-page__table-item">
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon farming-page__dark-icon"
                    :name="ICON_NAMES.daiCoin"
                  />
                  <i18n-t keypath="farming-page.balance-lbl" tag="span">
                    <template #curr>
                      {{ rewardToken.symbol.value }}
                    </template>
                  </i18n-t>
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(rewardBalance, rewardToken?.decimals.value)
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ rewardToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <app-block class="farming-page__table-block">
              <div class="farming-page__table-item">
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon"
                    :name="ICON_NAMES.gift"
                  />
                  {{ t('farming-page.total-reward-lbl') }}
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(
                          farming.totalRewardAmount.value,
                          rewardToken.decimals.value,
                        )
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ rewardToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <app-block class="farming-page__table-block">
              <!-- eslint-disable -->
              <div
                class="farming-page__table-item farming-page__table-item--colored"
              >
              <!-- eslint-enable -->
                <div class="farming-page__table-title">
                  <icon
                    class="farming-page__table-icon"
                    :name="ICON_NAMES.checkCircleFilled"
                  />
                  {{ t('farming-page.current-rewards-lbl') }}
                </div>
                <div class="farming-page__table-body">
                  <template v-if="isLoaded">
                    <span class="farming-page__table-count">
                      {{
                        formatAmount(
                          investInfo.rewards,
                          rewardToken.decimals.value,
                        )
                      }}
                    </span>
                    <span class="farming-page__table-currency">
                      {{ rewardToken.symbol.value }}
                    </span>
                  </template>
                  <loader v-else />
                </div>
              </div>
            </app-block>
            <template v-if="isClaimAvailable && isLoaded">
              <app-block>
                <app-button
                  class="farming-page__table-btn"
                  :text="t('farming-page.claim-btn')"
                  size="large"
                  scheme="borderless"
                  modification="border-rounded"
                  @click="isModalClaimingShown = true"
                />
              </app-block>
            </template>
          </div>
          <div class="farming-page__token-info-wrp">
            <div class="farming-page__token-info">
              <template v-if="isLoaded">
                <span class="farming-page__table-desc-text">
                  {{
                    `${$t('farming-page.reward-address-lbl')} (${
                      rewardToken.symbol.value
                    })`
                  }}
                </span>
                <link-copy
                  class="app__link--accented farming-page__table-desc-address"
                  :address="rewardToken.address.value"
                />
              </template>
              <loader v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-model:is-shown="isModalWithdrawingShown">
      <template #default="{ modal }">
        <div class="farming-page__modal">
          <div class="farming-page__modal-title-wrp">
            <div class="farming-page__modal-title">
              <icon class="farming-page__modal-icon" :name="$icons.hands" />
              {{ $t('farming-page.withdrawing-modal-title') }}
            </div>
            <app-button
              class="farming-page__modal-close"
              size="small"
              scheme="default"
              :icon-right="$icons.x"
              @click="modal.close"
            />
          </div>
          <p class="farming-page__modal-paragraph">
            {{ $t('farming-page.withdrawing-modal-text') }}
          </p>
          <div class="farming-page__modal-row">
            <span class="farming-page__modal-row-key">
              {{ $t('farming-page.withdrawing-modal-row-key') }}
            </span>
            <span class="farming-page__modal-row-value">
              {{
                formatAmount(investInfo.amount, investmentToken.decimals.value)
              }}
              <span class="farming-page__modal-row-currency">
                {{ investmentToken.symbol.value }}
              </span>
            </span>
          </div>
          <div class="farming-page__modal-input">
            <input-field
              class="app__module-field"
              v-model="withdrawForm.amount"
              scheme="secondary"
              :label="t('farming-page.withdrawing-modal-input-label')"
              :error-message="withdrawValidation.getFieldErrorMessage('amount')"
              @blur="withdrawValidation.touchField('amount')"
            />
            <app-button
              class="farming-page__modal-max-btn"
              :text="t('farming-page.withdrawing-modal-input-btn-lbl')"
              @click="clickMaxWithdrawAmount"
            />
          </div>
          <app-button
            class="farming-page__modal-btn"
            size="large"
            :text="t('farming-page.withdrawing-page-btn-lbl')"
            :disabled="!withdrawValidation.isFieldsValid.value"
            @click="submitWithdraw"
          />
        </div>
      </template>
    </modal>
    <modal v-model:is-shown="isModalStakingShown">
      <template #default="{ modal }">
        <div class="farming-page__modal">
          <div class="farming-page__modal-title-wrp">
            <div class="farming-page__modal-title">
              <icon class="farming-page__modal-icon" :name="$icons.coin" />
              {{ $t('farming-page.staking-modal-title') }}
            </div>
            <app-button
              class="farming-page__modal-close"
              size="small"
              scheme="default"
              :icon-right="$icons.x"
              @click="modal.close"
            />
          </div>
          <p class="farming-page__modal-paragraph">
            {{ $t('farming-page.staking-modal-text-first') }}
          </p>
          <div class="farming-page__modal-row">
            <span class="farming-page__modal-row-key">
              {{ $t('farming-page.staking-modal-row-key') }}
            </span>
            <span class="farming-page__modal-row-value">
              {{
                formatAmount(investmentBalance, investmentToken.decimals.value)
              }}
              <span class="farming-page__modal-row-currency">
                {{ investmentToken.symbol.value }}
              </span>
            </span>
          </div>
          <div class="farming-page__modal-input">
            <input-field
              class="app__module-field"
              v-model="stakingForm.amount"
              scheme="secondary"
              :label="t('farming-page.staking-modal-input-label')"
              :error-message="stakingValidation.getFieldErrorMessage('amount')"
              @blur="stakingValidation.touchField('amount')"
            />
            <app-button
              class="farming-page__modal-max-btn"
              :text="t('farming-page.staking-modal-input-btn-lbl')"
              @click="clickMaxStakingAmount"
            />
          </div>
          <app-button
            class="farming-page__modal-btn"
            size="large"
            :text="t('farming-page.staking-page-btn-lbl')"
            :disabled="!stakingValidation.isFieldsValid.value"
            @click="submitStaking"
          />
        </div>
      </template>
    </modal>
    <modal v-model:is-shown="isModalClaimingShown">
      <template #default="{ modal }">
        <div class="farming-page__modal">
          <div class="farming-page__modal-title-wrp">
            <div class="farming-page__modal-title">
              <icon class="farming-page__modal-icon" :name="$icons.hands" />
              {{ $t('farming-page.claiming-modal-title') }}
            </div>
            <app-button
              class="farming-page__modal-close"
              size="small"
              scheme="default"
              :icon-right="$icons.x"
              @click="modal.close"
            />
          </div>
          <p class="farming-page__modal-paragraph">
            {{ $t('farming-page.claiming-modal-text') }}
          </p>
          <div class="farming-page__modal-row">
            <span class="farming-page__modal-row-key">
              {{ $t('farming-page.claiming-modal-row-key') }}
            </span>
            <span class="farming-page__modal-row-value">
              {{ formatAmount(investInfo.rewards, rewardToken.decimals.value) }}
              <span class="farming-page__modal-row-currency">
                {{ rewardToken.symbol.value }}
              </span>
            </span>
          </div>
          <app-button
            class="farming-page__modal-btn"
            size="large"
            :text="t('farming-page.claiming-page-btn-lbl')"
            @click="submitClaim"
          />
        </div>
      </template>
    </modal>
  </div>
</template>

<style lang="scss" scoped>
.farming-page {
  padding: toRem(50) toRem(145) toRem(50) toRem(225);
  display: flex;
  gap: toRem(54);
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    padding: toRem(24);
  }
}

.farming-page__content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  gap: toRem(40);
}

.farming-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  left: -#{toRem(79)};
  padding: 0;
}

.farming-page__tables {
  display: flex;
  flex-direction: column;
  gap: toRem(40);

  @include respond-to(medium) {
    flex-direction: column-reverse;
  }
}

.farming-page__title-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.farming-page__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @include respond-to(medium) {
    justify-content: start;

    & > * {
      margin-left: toRem(10);
    }
  }
}

.farming-page__heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 900;
  font-size: toRem(70);
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(36);
  }
}

.farming-page__title-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  & > .farming-page__table-block:not(:last-child) {
    padding-right: toRem(0);
  }

  @include respond-to(medium) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);

    & > .farming-page__table-block:not(:last-child) {
      padding-right: toRem(1);
      padding-bottom: toRem(0);
    }
  }
}

.farming-page__table-title {
  display: flex;
  gap: toRem(14);
  font-size: toRem(16);
  font-family: var(--app-font-family-secondary);
  font-weight: 600;
  color: var(--text-secondary-main);
}

.farming-page__table-icon {
  min-width: toRem(16);
  min-height: toRem(16);
  max-width: toRem(16);
  max-height: toRem(16);
}

.farming-page__under-table-icon {
  min-width: toRem(12);
  min-height: toRem(12);
  max-width: toRem(12);
  max-height: toRem(12);
  color: var(--text-primary-main);
}

.farming-page__dark-icon {
  color: var(--primary-main);
}

.farming-page__table-item {
  padding: toRem(30) toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  border-radius: toRem(12);

  &--colored {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & .farming-page__table-title {
      color: var(--text-primary-invert-main);

      & .farming-page__table-icon {
        color: var(--text-primary-invert-main);
      }
    }
  }
}

.farming-page__table-body {
  display: flex;
  align-items: flex-end;
  gap: toRem(6);

  .vue-skeletor {
    height: toRem(20);
  }
}

.farming-page__table-count {
  font-weight: 800;
  font-size: toRem(20);
}

.farming-page__table-currency {
  font-weight: 700;
  font-size: toRem(12);
}

.farming-page__table-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  background-color: var(--primary-main);

  &--no-withdraw {
    grid-template-columns: 1fr;
  }
}

.farming-page__table-btn {
  width: 100%;
  height: 100%;
  padding: toRem(1);

  &--white {
    background-color: var(--background-secondary);
  }
}

.farming-page__table-desc-text {
  padding: toRem(14) 0;
  font-size: toRem(12);
  color: var(--text-secondary-main);
  font-weight: 700;
}

.farming-page__table-desc-address {
  justify-self: end;
}

.farming-page__charts-history-wrp {
  display: flex;
  flex-direction: column;
}

.farming-page__charts {
  display: grid;
  grid-template-columns: minmax(#{toRem(346)}, 1fr) minmax(#{toRem(693)}, 2fr);
}

.farming-page__chart {
  padding: toRem(40);
}

.farming-page__history {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}

.farming-page__history-item {
  padding: toRem(40);
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.farming-page__history-title {
  display: flex;
  justify-content: space-between;
}

.farming-page__history-heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: toRem(20);
}

.farming-page__history-currency {
  font-weight: 700;
  font-size: toRem(14);
  display: flex;
  gap: toRem(10);
  align-items: center;
}

.farming-page__history-currency-icon {
  height: toRem(24);
  width: toRem(24);
}

.farming-page__history-table {
  display: flex;
  flex-direction: column;
}

.farming-page__history-time {
  padding: toRem(20) 0 toRem(10);
  font-weight: 700;
  font-family: var(--app-font-family-secondary);
  color: var(--text-secondary-main);
}

.farming-page__history-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__row {
  padding: toRem(20) toRem(10);
  display: flex;
  justify-content: space-between;
  border-bottom: toRem(1) solid var(--border-primary-main);
  font-weight: 700;

  &--selected {
    color: var(--secondary-main);
  }
}

.farming-page__row-key {
  display: flex;
  gap: toRem(5);
  align-items: center;
}

.farming-page__modal {
  display: flex;
  flex-direction: column;
  gap: toRem(40);
  background-color: var(--background-primary);
  padding: toRem(20) toRem(40);
  width: toRem(550);

  @include respond-to(medium) {
    width: 100%;
    padding: toRem(20);
    gap: toRem(30);
  }
}

.farming-page__modal-title-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.farming-page__modal-title {
  display: flex;
  align-items: center;
  gap: toRem(18);
  font-family: var(--app-font-family-secondary);
  font-size: toRem(30);
  font-weight: 700;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}

.farming-page__modal-icon {
  width: toRem(30);
  height: toRem(30);
  color: var(--secondary-main);
}

.farming-page__modal-close {
  padding: 0;
  width: toRem(20);
  height: toRem(20);
  color: var(--text-secondary-main);
  cursor: pointer;
}

.farming-page__modal-paragraph {
  line-height: toRem(20);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.farming-page__modal-row {
  display: flex;
  justify-content: space-between;

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(10);
  }
}

.farming-page__modal-row-key {
  font-size: toRem(14);
  color: var(--text-secondary-main);
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(12);
  }
}

.farming-page__modal-row-value {
  font-size: toRem(16);
  font-weight: 700;
}

.farming-page__modal-row-currency {
  font-size: toRem(12);
}

.farming-page__modal-input {
  display: flex;
  gap: toRem(10);
}

.farming-page__modal-max-btn {
  padding: 0 toRem(20);
  font-size: toRem(14);
  max-height: toRem(56);

  @include respond-to(xsmall) {
    padding: 0 toRem(10);
  }
}

.farming-page__modal-btn {
  width: 100%;
  height: toRem(52);
  padding-top: toRem(16);
  padding-bottom: toRem(16);
}

.farming-page__history-grid {
  padding-top: toRem(30);
}

.farming-page__claim-not-available {
  grid-template-columns: repeat(3, 1fr);

  @include respond-to(medium) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
  }
}

.farming-page__token-info-wrp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: toRem(5) 0;

  @include respond-to(medium) {
    grid-template-columns: 1fr;
  }
}

.farming-page__token-info {
  display: flex;
  justify-content: space-between;

  .loader {
    height: toRem(40);

    .vue-skeletor {
      border-radius: 0;
    }
  }

  @include respond-to(medium) {
    flex-direction: column;
  }
}
</style>
