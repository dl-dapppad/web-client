<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { AppButton, Icon, AppBlock, Modal, FarmingHistory } from '@/common'
import { InputField } from '@/fields'
import { cropAddress, getMaxUint256, txWrapper } from '@/helpers'
import { useRouter } from '@/router'
import { copyToClipboard, formatAmount } from '@/helpers'
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
const { t } = i18n.global

const router = useRouter()
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
}

const updateBalanceState = async () => {
  if (!provider.value.selectedAddress) return

  await Promise.all([
    farming.accountInvestInfo(provider.value.selectedAddress),
    farming.getRewards(provider.value.selectedAddress),
    investmentToken.balanceOf(provider.value.selectedAddress),
  ]).then(res => {
    investInfo.value.amount = res[0].amount
    investInfo.value.rewards = res[1]
    investmentBalance.value = res[2]

    return
  })
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

  // TODO: add amount to tx after adding feature to SC
  // const amount = new BN(withdrawForm.amount)
  //   .toFraction(investmentToken.decimals.value)
  //   .toString()

  await txWrapper(farming.withdraw, {
    receiver: provider.value.selectedAddress,
  })
  await updateBalanceState()

  isModalWithdrawingShown.value = false
}

init()
</script>

<template>
  <div class="farming-page">
    <div class="farming-page__content">
      <div class="farming-page__title-wrp">
        <div class="farming-page__title">
          <app-button
            class="farming-page__back-btn"
            :icon-left="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
            @click="router.go(-1)"
          />
          <div class="farming-page__heading">
            {{ $t('farming-page.title') }}
          </div>
          <div
            class="farming-page__title-address"
            :title="farming.address.value"
            @click="copyToClipboard(farming.address.value)"
          >
            {{ cropAddress(farming.address.value) }}
            <icon
              class="farming-page__title-icon"
              :name="$icons.duplicateFilled"
            />
          </div>
        </div>
        <div class="farming-page__subtitle">
          {{ $t('farming-page.subtitle') }}
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="ICON_NAMES.coins" />
              {{ t('farming-page.total-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
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
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="ICON_NAMES.coin" />
              {{ t('farming-page.my-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
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
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-buttons">
            <app-button
              class="farming-page__table-btn"
              size="large"
              color="tertiary"
              scheme="borderless"
              @click="isModalWithdrawingShown = true"
            >
              {{ $t('farming-page.withdraw-btn') }}
            </app-button>
            <div class="farming-page__table-buttons-separator" />
            <app-button
              class="farming-page__table-btn"
              size="large"
              scheme="borderless"
              @click="isModalStakingShown = true"
            >
              {{ $t('farming-page.stake-btn') }}
            </app-button>
          </div>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{
              `${$t('farming-page.stake-address-lbl')} (${
                investmentToken.symbol.value
              })`
            }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="investmentToken.address.value"
            @click="copyToClipboard(investmentToken.address.value)"
          >
            {{ cropAddress(investmentToken.address.value) }}
            <icon
              class="farming-page__under-table-icon"
              :name="$icons.duplicateFilled"
            />
          </span>
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="ICON_NAMES.gift" />
              {{ t('farming-page.total-reward-lbl') }}
            </div>
            <div class="farming-page__table-body">
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
            </div>
          </div>
        </app-block>
        <app-block>
          <div
            class="farming-page__table-item farming-page__table-item--secondary"
          >
            <div class="farming-page__table-title">
              <icon
                class="farming-page__table-icon"
                :name="ICON_NAMES.checkCircleFilled"
              />
              {{ t('farming-page.current-rewards-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{
                  formatAmount(investInfo.rewards, rewardToken.decimals.value)
                }}
              </span>
              <span class="farming-page__table-currency">
                {{ rewardToken.symbol.value }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <app-button
            class="farming-page__table-btn"
            size="large"
            scheme="borderless"
            @click="isModalClaimingShown = true"
          >
            {{ $t('farming-page.claim-btn') }}
          </app-button>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{
              `${$t('farming-page.reward-address-lbl')} (${
                rewardToken.symbol.value
              })`
            }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="rewardToken.address.value"
            @click="copyToClipboard(rewardToken.address.value)"
          >
            {{ cropAddress(rewardToken.address.value) }}
            <icon
              class="farming-page__under-table-icon"
              :name="$icons.duplicateFilled"
            />
          </span>
        </div>
      </div>
      <farming-history class="farming-page__history-grid" />
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
          <div class="farming-page__modal-raw">
            <span class="farming-page__modal-raw-key">
              {{ $t('farming-page.withdrawing-modal-raw-key') }}
            </span>
            <span class="farming-page__modal-raw-value">
              {{
                formatAmount(investInfo.amount, investmentToken.decimals.value)
              }}
              <span class="farming-page__modal-raw-currency">
                {{ investmentToken.symbol.value }}
              </span>
            </span>
          </div>
          <div class="farming-page__modal-input">
            <input-field
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
          <p class="farming-page__modal-paragraph">
            {{ $t('farming-page.staking-modal-text-second') }}
          </p>
          <div class="farming-page__modal-raw">
            <span class="farming-page__modal-raw-key">
              {{ $t('farming-page.staking-modal-raw-key') }}
            </span>
            <span class="farming-page__modal-raw-value">
              {{
                formatAmount(investmentBalance, investmentToken.decimals.value)
              }}
              <span class="farming-page__modal-raw-currency">
                {{ investmentToken.symbol.value }}
              </span>
            </span>
          </div>
          <div class="farming-page__modal-input">
            <input-field
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
          <div class="farming-page__modal-raw">
            <span class="farming-page__modal-raw-key">
              {{ $t('farming-page.claiming-modal-raw-key') }}
            </span>
            <span class="farming-page__modal-raw-value">
              {{ formatAmount(investInfo.rewards, rewardToken.decimals.value) }}
              <span class="farming-page__modal-raw-currency">
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
  padding: toRem(70) toRem(115) toRem(70) toRem(140);
  display: flex;
  gap: toRem(54);
  letter-spacing: 0.1em;
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
}

.farming-page__heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 900;
  font-size: toRem(70);
  letter-spacing: 0.1em;
}

.farming-page__title-address {
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
  font-size: toRem(30);
  display: flex;
  align-items: center;
  gap: toRem(20);
  cursor: pointer;
}

.farming-page__title-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__subtitle {
  font-size: toRem(16);
}

.farming-page__table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.farming-page__table-item {
  padding: toRem(30) toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  border-radius: toRem(12);

  &--secondary {
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
  grid-template-columns: 1fr toRem(2) 1fr;
  height: 100%;
}

.farming-page__table-buttons-separator {
  background-color: var(--primary-main);
}

.farming-page__table-btn {
  width: 100%;
  height: 100%;
  padding: toRem(1);
}

.farming-page__table-desc {
  padding: toRem(14) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.farming-page__table-desc-text {
  font-size: toRem(12);
  color: var(--text-secondary-main);
  font-weight: 700;
}

.farming-page__table-desc-address {
  display: flex;
  gap: toRem(10);
  color: var(--secondary-main);
  font-weight: 700;
  cursor: pointer;
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
}

.farming-page__modal-raw {
  display: flex;
  justify-content: space-between;
}

.farming-page__modal-raw-key {
  font-size: toRem(14);
  color: var(--text-secondary-main);
  font-weight: 700;
}

.farming-page__modal-raw-value {
  font-size: toRem(16);
  font-weight: 700;
}

.farming-page__modal-raw-currency {
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
}

.farming-page__modal-btn {
  width: 100%;
  padding-top: toRem(16);
  padding-bottom: toRem(16);
}

.farming-page__history-grid {
  padding-top: toRem(30);
}
</style>
