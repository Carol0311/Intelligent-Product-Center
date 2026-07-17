<template>
  <FoldAndOpen class="p-layout" :data="{ name: '布局', open: true }">
    <div class="display-box flex flex-row m-auto mb-2 justify-between items-center">
      <div>布局模式</div>
      <div class="flex flex-row items-center rounded bg-gray-100 select-item">
        <div
          v-for="item in display"
          :key="item.id"
          class="text-orange-300 p-0.5 ml-0.5 rounded cursor-pointer"
          @click="clickEvt(item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <div v-if="showFlexItem" class="display-box flex flex-col m-auto mb-2 justify-between">
      <div>flexDirection</div>
      <div class="flex flex-row items-center rounded bg-gray-100 select-item">
        <div
          v-for="item in flexDirection"
          :key="item.id"
          class="text-orange-300 p-0.5 ml-0.5 rounded cursor-pointer"
          @click="clickFlexItem('flex-direction', item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <div v-if="showFlexItem" class="display-box flex flex-col m-auto mb-2 justify-between">
      <div>justifyContent</div>
      <div class="flex flex-row bg-gray-100 items-center rounded text-center select-item">
        <div
          v-for="item in justifyContent"
          :key="item.id"
          class="text-orange-300 p-0.5 rounded cursor-pointer"
          @click="clickFlexItem('justify-content', item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <div v-if="showFlexItem" class="display-box flex flex-col m-auto mb-2 justify-between">
      <div>alignItems</div>
      <div class="flex flex-row items-center rounded bg-gray-100 text-center select-item">
        <div
          v-for="item in alignItems"
          :key="item.id"
          class="text-orange-300 p-0.5 ml-0.5 rounded cursor-pointer"
          @click="clickFlexItem('align-items', item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <div class="layout relative m-auto mb-2">
      <div class="margin-top">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.mt"
            class="w-full"
            @change="(e) => changeEvt(e, 'margin-top')"
          />
        </span>
      </div>
      <div class="margin-right">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.mr"
            @change="(e) => changeEvt(e, 'margin-right')"
          />
        </span>
      </div>
      <div class="margin-bottom">
        <div class="float-left relative text-gray-300">margin</div>
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.mb"
            class="w-full"
            @change="(e) => changeEvt(e, 'margin-bottom')"
          />
        </span>
      </div>
      <div class="margin-left">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.ml"
            @change="(e) => changeEvt(e, 'margin-left')"
          />
        </span>
      </div>
      <div class="padding-top">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.pt"
            class="w-full"
            @change="(e) => changeEvt(e, 'padding-top')"
          />
        </span>
      </div>
      <div class="padding-right">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.pr"
            @change="(e) => changeEvt(e, 'padding-right')"
          />
        </span>
      </div>
      <div class="padding-bottom">
        <div class="float-left relative text-gray-300">padding</div>
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.pb"
            class="w-full"
            @change="(e) => changeEvt(e, 'padding-bottom')"
          />
        </span>
      </div>
      <div class="padding-left">
        <span>
          <input
            type="text"
            placeholder="0"
            :value="mp.pl"
            @change="(e) => changeEvt(e, 'padding-left')"
          />
        </span>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <PUnit
        :data="{ name: '宽度', unit: 'px', number: mp.w }"
        @change="(arg) => updateValue(arg, 'width')"
      />
      <PUnit
        :data="{ name: '高度', unit: 'px', number: mp.h }"
        @change="(arg) => updateValue(arg, 'height')"
      />
    </div>
  </FoldAndOpen>
</template>
<script lang="ts" setup>
import { ref, reactive, markRaw, watch, inject } from 'vue'
import { PhSquareLogo } from '@phosphor-icons/vue'
import { vDialog } from 'public-shared'
import { PUnit, FoldAndOpen } from './index'

const showFlexItem = ref(false)

const display = ref([
  { value: 'inline', id: 'dInline' },
  { value: 'flex', id: 'dFlex' },
  { value: 'block', id: 'dBlock' },
  { value: 'inline-block', id: 'dInBlock' },
  { value: 'none', id: 'dNone' },
])
const flexDirection = ref([
  { value: 'row', id: 'flexRow' },
  { value: 'column', id: 'flexColumn' },
  { value: 'row-reverse', id: 'flexRowReverse' },
  { value: 'column-reverse', id: 'flexColumnReverse' },
])
const justifyContent = ref([
  { value: 'flex-start', id: 'justifyStart' },
  { value: 'center', id: 'justifyCenter' },
  { value: 'flex-end', id: 'justifyEnd' },
  { value: 'space-between', id: 'justifyBetween' },
  { value: 'space-around', id: 'justifyAround' },
])
const alignItems = ref([
  { value: 'flex-start', id: 'alignStart' },
  { value: 'center', id: 'alignCenter' },
  { value: 'flex-end', id: 'alignEnd' },
  { value: 'baseline', id: 'alignBaseline' },
  { value: 'stretch', id: 'alignStretch' },
])
const propsChange = inject<{ update: () => void }>('propsChange')
const model = defineModel<Record<string, any>>({})
//更新padding margin
const changeEvt = (e: Event, p: string) => {
  const target = e.target as HTMLInputElement
  const v = target.value.replace(/px/g, '').trim()
  model.value = {
    ...model.value,
    [p]: v.length > 0 ? `${v}px` : 0,
  }
  propsChange?.update()
}
//更新display
const clickEvt = (val: string) => {
  showFlexItem.value = val === 'flex'
  if (val !== 'flex') {
    model.value = { ...model.value, display: val }
    propsChange?.update()
  }
}
const clickFlexItem = (p: string, val: string) => {
  model.value = { ...model.value, display: 'flex', [p]: val }
  propsChange?.update()
}
//更新宽度和高度
const updateValue = (arg: any, p: string) => {
  if (arg.number === '' && model.value?.hasOwnProperty(p)) {
    //替换引用的方式删除styleData---inlineStyle对象中的属性
    const newModel = { ...model.value }
    delete newModel[p]
    model.value = newModel
  } else {
    model.value = { ...model.value, [p]: `${arg.number}px` }
  }
  propsChange?.update()
}
const mp = reactive<Record<string, any>>({
  mt: model.value?.['margin-bottom'] || 0,
  mb: model.value?.['margin-bottom'] || 0,
  ml: model.value?.['margin-left'] || 0,
  mr: model.value?.['margin-right'] || 0,
  pt: model.value?.['padding-top'] || 0,
  pb: model.value?.['padding-bottom'] || 0,
  pl: model.value?.['padding-left'] || 0,
  pr: model.value?.['padding-right'] || 0,
  w: model.value?.width,
  h: model.value?.height,
})
watch(
  () => model.value,
  (newVal) => {
    mp['w'] = newVal?.width
    mp['h'] = newVal?.height
    mp['mt'] = newVal?.['margin-top'] || 0
    mp['mt'] = newVal?.['margin-top'] || 0
    mp['mb'] = newVal?.['margin-bottom'] || 0
    mp['ml'] = newVal?.['margin-left'] || 0
    mp['mr'] = newVal?.['margin-right'] || 0
    mp['pt'] = newVal?.['padding-top'] || 0
    mp['pb'] = newVal?.['padding-bottom'] || 0
    mp['pl'] = newVal?.['padding-left'] || 0
    mp['pr'] = newVal?.['padding-right'] || 0
  },
  { deep: true },
)
</script>
<style scoped>
.p-layout .layout {
  width: 100%;
  height: 150px;
}
.p-layout .display-box {
  width: 100%;
}
.p-layout .layout > div {
  position: absolute;
  background: transparent;
}
.p-layout .layout > div span {
  position: absolute;
}
.p-layout .layout > div span input {
  text-align: center;
}
.p-layout .select-item div {
  position: relative;
}
.p-layout .select-item div::after {
  content: '';
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 10px;
  background: rgb(212 212 216);
}
.p-layout .select-item div:last-child:after {
  height: 0;
}
.margin-top {
  width: 260px;
  height: 20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.margin-top span,
.padding-top span {
  height: 20px;
  width: 100%;
  left: 0;
  right: 0;
  top: -20px;
}
.margin-right {
  right: 0;
  top: 3px;
  width: 20px;
  height: 144px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.margin-right span,
.padding-right span {
  width: 20px;
  height: 100%;
}
.margin-right span input,
.padding-right span input,
.margin-left span input,
.padding-left span input {
  position: absolute;
  right: -10px;
  width: 40px;
  top: 40px;
  height: 20px;
}
.padding-right span input,
.padding-left span input {
  top: 10px;
}
.margin-bottom {
  bottom: 0;
  width: 260px;
  height: 20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.margin-bottom span,
.padding-bottom span {
  height: 20px;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 2;
}
.margin-left {
  left: 0;
  top: 3px;
  width: 20px;
  height: 144px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.margin-left span,
.padding-left span {
  width: 20px;
  height: 100%;
  left: -20px;
}
.padding-top {
  top: 30px;
  left: 30px;
  width: 200px;
  height: 20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.padding-right {
  right: 30px;
  top: 33px;
  width: 20px;
  height: 84px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.padding-bottom {
  bottom: 30px;
  left: 30px;
  width: 200px;
  height: 20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.padding-left {
  left: 30px;
  top: 33px;
  width: 20px;
  height: 84px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
</style>
