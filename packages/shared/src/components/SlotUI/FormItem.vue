<template>
  <div v-if="props.data.props.inTable" :class="[isCheckType ? ui.uiStatic.checkbox : ui.uiStatic.inputBox, isCheckType ? '' : inputBox]" :style="config.inlineStyle">
    <slot name="cellMain" :config="config" :ui="ui" :icon="dynamicIcon" :check-icon="checkIcon" :platForm="platForm"></slot>
  </div>
  <template v-else>
    <div v-bind="$attrs" :class="[ui.uiStatic.item, item]" :style="{ 'grid-column': config.col && `span ${config.col}` }">
      <div v-if="labelPos !== 'inner'" :class="[ui.uiStatic.outLabel, outLabel]">
        <label>{{ config.label }}</label>
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhQuestion v-if="config.tip" v-dialog:[config.cid]="config.label" :size="16" weight="light" class="inline-block mb-1 cursor-pointer" />
          <PhAsterisk v-if="config.require" :size="10" class="text-red-500 inline-block absolute translate-y-2" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhQuestion v-if="config.tip" v-dialog:[config.cid]="config.label" :size="16" weight="light" class="inline-block mb-1 cursor-pointer" />
        <PhAsterisk v-if="config.require" :size="10" class="text-red-500 inline-block absolute translate-y-2" />
        <!--#endif-->
      </div>
      <div :class="[isCheckType ? ui.uiStatic.checkCtrl : ui.uiStatic.ctrl, ctrl]">
        <span :class="[isCheckType ? ui.uiStatic.checkbox : ui.uiStatic.inputBox, isCheckType ? '' : inputBox]" :style="config.inlineStyle">
          <label v-if="labelPos === 'inner'" :class="ui.uiStatic.innerLabel">
            <div>
              <label>{{ config.label }}</label>
              <!--#if [PRODUCT]-->
              <ClientOnly>
                <PhQuestion v-if="config.tip" v-dialog:[config.cid]="config.label" :size="16" weight="light" class="inline-block mb-1 cursor-pointer" />
                <PhAsterisk v-if="config.require" :size="10" class="text-red-500 inline-block absolute translate-y-1" />
              </ClientOnly>
              <!--#endif-->
              <!--#if [LOWCODE]-->
              <PhQuestion v-if="config.tip" v-dialog:[config.cid]="config.label" :size="16" weight="light" class="inline-block mb-1 cursor-pointer" />
              <PhAsterisk v-if="config.require" :size="10" class="text-red-500 inline-block absolute translate-y-1" />
              <!--#endif-->
              <PhQuestion v-if="config.tip" v-dialog:[config.cid]="config.label" :size="16" weight="light" class="inline-block mb-1 cursor-pointer" />
              <PhAsterisk v-if="config.require" :size="10" class="text-red-500 inline-block absolute translate-y-1" />
            </div>
          </label>
          <slot name="main" :config="config" :ui="ui" :icon="dynamicIcon" :check-icon="checkIcon" :isCheckType="isCheckType" :platForm="platForm"></slot>
        </span>
        <Tips v-if="config.errTip || config.helpTip" :err-tip="config.errTip" :help-tip="config.helpTip" />
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { PhQuestion, PhAsterisk } from '@phosphor-icons/vue'
import { useUiConfig } from '@shared/composables/useUiConfig'
import { Tips } from '@shared/components/ToolUI'
import { vDialog } from '@shared/plugins/CusDirectives'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const ui = props.data.props.inTable ? useUiConfig(undefined, props.data as ColumnSchema) : useUiConfig((props.data as ComponentSchema).id, undefined, { isFormItem: true })
const config = props.data.props.inTable ? props.data.props : ui.config
const { labelPos } = ui.uiByParent
const { item, outLabel, ctrl, inputBox, checkIcon } = ui.uiClass
const dynamicIcon = ui.getIcon(props.data.type)
const isCheckType = ref(false)
isCheckType.value = ['SCheckbox', 'CheckboxGroup', 'Radio', 'RadioGroup', 'Switch'].includes(props.data.type)

const platForm = ref<string>('')
// #if [PRODUCT]
platForm.value = 'product'
// #endif

// #if [LOWCODE]
platForm.value = 'lowcode'
// #endif
</script>
<style scoped></style>
