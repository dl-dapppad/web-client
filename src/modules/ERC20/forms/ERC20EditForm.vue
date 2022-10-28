<script lang="ts" setup>
import { AppBlock, AppButton, Tabs } from '@/common'
import { InputField } from '@/fields'

import { Bus, cropAddress, ErrorHandler } from '@/helpers'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

const FORM_TABS = [
  {
    title: 'Read',
    number: 1,
  },
  {
    title: 'Write',
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)

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
    <div class="app__module-title-wrp">
      <app-button
        type="button"
        class="app__module-back-btn"
        :icon-right="$icons.arrowLeft"
        modification="border-circle"
        color="tertiary"
        @click="router.go(-1)"
      />
      <h2 class="app__module-title">
        {{ 'Editing' }}
      </h2>
      <app-button
        type="button"
        class="app__module-title-address"
        :text="`Contract ${cropAddress(
          '0xC87B0398F86276D3D590A14AB53fF57185899C42',
        )}`"
        :icon-right="$icons.duplicate"
        scheme="default"
        size="default"
      />
    </div>
    <span class="app__module-subtitle">
      {{
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      }}
    </span>
    <tabs
      v-model="currentTabNumber"
      :tabs-data="[
        { title: 'Read', number: 1 },
        { title: 'Write', number: 2 },
      ]"
    />
    <app-block>
      <div class="app__module-content">
        <h4 class="app__module-content-title">
          {{ 'Read block' }}
        </h4>
        <div class="app__metadata">
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Max total Supplie' }}
            </span>
            <span class="app__metadata-value">
              {{ '32 310 389.1234 USDT' }}
            </span>
          </div>
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Contract creator' }}
            </span>
            <span class="app__metadata-value">
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
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Token Tracker' }}
            </span>
            <span class="app__metadata-value">
              <app-button
                scheme="default"
                color="secondary"
                size="default"
                :text="'Tether USD (USDT)'"
              />
            </span>
          </div>
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Contract owner' }}
            </span>
            <span class="app__metadata-value">
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
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Contract' }}
            </span>
            <span class="app__metadata-value">
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
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Decimals' }}
            </span>
            <span class="app__metadata-value">
              {{ '6' }}
            </span>
          </div>
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ 'Your balance' }}
            </span>
            <span class="app__metadata-value">
              {{ '12 345.1234 SHIT' }}
            </span>
          </div>
        </div>
        <h4 class="app__module-content-title">
          {{ 'Edit block' }}
        </h4>
        <div class="app__form-control">
          <span class="app__form-control-title">
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
        <div class="app__form-control">
          <span class="app__form-control-title">
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
        <div class="app__form-control">
          <span class="app__form-control-title">
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
        <div class="app__form-control">
          <span class="app__form-control-title">
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
