<script lang="ts" setup>
import { AppBlock, AppButton } from '@/common'
import { InputField } from '@/fields'

import { Bus, cropAddress, ErrorHandler } from '@/helpers'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const approveForm = reactive({
  spenderAddress: '',
  valueAmount: '',
})

const transferFromForm = reactive({
  fromAddress: '',
  toAddress: '',
  valueAmount: '',
})

const transferForm = reactive({
  toAddress: '',
  valueAmount: '',
})

const transferOwnershipForm = reactive({
  newOwnerAddress: '',
})

const handleApprove = () => {
  try {
    Bus.success('approve')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransferFrom = () => {
  try {
    Bus.success('transferFrom')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransfer = () => {
  try {
    Bus.success('transfer')
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleTransferOwnership = () => {
  try {
    Bus.success('transferOwnership')
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<template>
  <div class="erc20-edit-form">
    <div class="erc20-edit-form__title-wrp">
      <app-button
        type="button"
        class="erc20-edit-form__back-btn"
        :icon-right="$icons.arrowLeft"
        modification="border-circle"
        color="tertiary"
        @click="router.go(-1)"
      />
      <h2 class="erc20-edit-form__title">
        {{ 'Editing' }}
      </h2>
      <app-button
        type="button"
        class="erc20-edit-form__address"
        :text="`Contract ${cropAddress(
          '0xC87B0398F86276D3D590A14AB53fF57185899C42',
        )}`"
        :icon-right="$icons.duplicate"
        scheme="default"
        size="default"
      />
    </div>
    <span class="erc20-edit-form__subtitle">
      {{
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      }}
    </span>
    <div class="erc20-edit-form__tabs">
      <app-block>
        <app-button
          type="button"
          size="small"
          :text="'Read'"
          color="secondary"
          modification="border-rounded"
        />
      </app-block>
      <app-block>
        <app-button
          type="button"
          size="small"
          :text="'Write'"
          scheme="default"
        />
      </app-block>
    </div>
    <app-block class="erc20-edit-form__content-wrp">
      <div class="erc20-edit-form__content">
        <h4 class="erc20-edit-form__content-title">
          {{ 'Read block' }}
        </h4>
        <div class="erc20-edit-form__metadata">
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Max total Supplie' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              {{ '32 310 389.1234 USDT' }}
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Contract creator' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              <app-button
                scheme="default"
                color="secondary"
                size="default"
                :text="
                  cropAddress('0xC87B0398F86276D3D590A14AB53fF57185899C42')
                "
                :icon-right="$icons.duplicate"
              />
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Token Tracker' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              <app-button
                scheme="default"
                color="secondary"
                size="default"
                :text="'Tether USD (USDT)'"
              />
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Contract owner' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              <app-button
                scheme="default"
                color="secondary"
                size="default"
                :text="
                  cropAddress('0xC87B0398F86276D3D590A14AB53fF57185899C42')
                "
                :icon-right="$icons.duplicate"
              />
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Contract' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              <app-button
                scheme="default"
                color="secondary"
                size="default"
                :text="
                  cropAddress('0xC87B0398F86276D3D590A14AB53fF57185899C42')
                "
                :icon-right="$icons.duplicate"
              />
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Decimals' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              {{ '6' }}
            </span>
          </div>
          <div class="erc20-edit-form__metadata-item">
            <span class="erc20-edit-form__metadata-lbl">
              {{ 'Your balance' }}
            </span>
            <span class="erc20-edit-form__metadata-value">
              {{ '12 345.1234 SHIT' }}
            </span>
          </div>
        </div>
        <h4 class="erc20-edit-form__content-title">
          {{ 'Edit block' }}
        </h4>
        <div class="erc20-edit-form__form-control">
          <span class="erc20-edit-form__form-control-lbl">
            {{ 'Approve' }}
          </span>
          <input-field
            v-model="approveForm.spenderAddress"
            scheme="secondary"
            :label="'Spender'"
          />
          <input-field
            v-model="approveForm.valueAmount"
            scheme="secondary"
            :label="'Value'"
          />
          <app-button
            type="button"
            :text="'Save Changes'"
            size="small"
            @click="handleApprove"
          />
        </div>
        <div class="erc20-edit-form__form-control">
          <span class="erc20-edit-form__form-control-lbl">
            {{ 'Transfer From' }}
          </span>
          <input-field
            v-model="transferFromForm.fromAddress"
            scheme="secondary"
            :label="'From'"
          />
          <input-field
            v-model="transferFromForm.toAddress"
            scheme="secondary"
            :label="'To'"
          />
          <input-field
            v-model="transferFromForm.valueAmount"
            scheme="secondary"
            :label="'Value'"
          />
          <app-button
            type="button"
            :text="'Save Changes'"
            size="small"
            @click="handleTransferFrom"
          />
        </div>
        <div class="erc20-edit-form__form-control">
          <span class="erc20-edit-form__form-control-lbl">
            {{ 'Transfer' }}
          </span>
          <input-field
            v-model="transferForm.toAddress"
            scheme="secondary"
            :label="'To'"
          />
          <input-field
            v-model="transferForm.valueAmount"
            scheme="secondary"
            :label="'Value'"
          />
          <app-button
            type="button"
            :text="'Save Changes'"
            size="small"
            @click="handleTransfer"
          />
        </div>
        <div class="erc20-edit-form__form-control">
          <span class="erc20-edit-form__form-control-lbl">
            {{ 'Transfer Ownership' }}
          </span>
          <input-field
            v-model="transferOwnershipForm.newOwnerAddress"
            scheme="secondary"
            :label="'New owner address'"
          />
          <app-button
            type="button"
            :text="'Save Changes'"
            size="small"
            @click="handleTransferOwnership"
          />
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.erc20-edit-form {
  display: flex;
  flex-direction: column;
  padding: toRem(50) 0 toRem(30);
  max-width: toRem(990);
  width: 100%;
  margin: 0 auto;
}

.erc20-edit-form__title-wrp {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(20);
}

.erc20-edit-form__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;
}

.erc20-edit-form__title {
  font-size: toRem(70);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.erc20-edit-form__address {
  grid-gap: toRem(20);
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  text-align: right;
  letter-spacing: 0.1em;
}

.erc20-edit-form__subtitle {
  font-size: toRem(16);
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: 0.1em;
  margin-bottom: toRem(40);
}

.erc20-edit-form__tabs {
  display: flex;
}

.erc20-edit-form__content {
  flex: 1;
  padding: toRem(40) toRem(165);
}

.erc20-edit-form__content-title {
  font-size: toRem(24);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: toRem(30);
}

.erc20-edit-form__metadata {
  display: flex;
  flex-direction: column;
  margin-bottom: toRem(70);
  gap: toRem(20);
}

.erc20-edit-form__metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.erc20-edit-form__metadata-lbl {
  font-size: toRem(14);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-secondary-main);
}

.erc20-edit-form__metadata-value {
  text-align: right;
  font-size: toRem(16);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.erc20-edit-form__form-control {
  display: flex;
  flex-direction: column;
  gap: toRem(20);

  &:not(:last-child) {
    margin-bottom: toRem(30);
  }
}

.erc20-edit-form__form-control-lbl {
  display: block;
  font-weight: 700;
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  color: var(--text-secondary-main);
}
</style>
