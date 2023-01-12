<script lang="ts" setup>
import { BaseDeployForm } from '@/modules/erc20/forms'

import { i18n } from '@/localization'
import { required, numeric } from '@/validators'
import { OVERVIEW_ROW } from '@/modules/enums'

const { t } = i18n.global

const categories = [
  {
    index: 0,
    inputs: [
      {
        index: 3,
        input: {
          name: 'cap',
          label: t('product-deploy.erc20-common.cap-lbl'),
          tooltip: t('product-deploy.erc20-common.cap-info'),
          validators: [required, numeric],
        },
      },
    ],
  },
]

const additionalModalRows = [
  {
    index: 3,
    row: {
      id: 'cap',
      name: t('product-deploy.modal.cap-lbl'),
      value: '',
      type: OVERVIEW_ROW.default,
    },
  },
]

const deployArrayIDParam = [
  {
    id: 'cap',
    index: 5,
    isConvertingToFraction: true,
  },
]
</script>

<template>
  <base-deploy-form
    :deploy-array="deployArrayIDParam"
    :additional-modal-rows="additionalModalRows"
    :categories="categories"
  />
</template>
