<template>
  <div class="lowcode-left relative">
    <div class="menu-list w-12 h-full bg-white">
      <div class="menu">
        <PhTreeView v-dialog="{ id: domTree, value: text }" :size="20" weight="thin" />
      </div>
      <div class="menu" @click="() => (showDetl = true)">
        <PhPuzzlePiece v-dialog="{ id: comTree, value: text2 }" :size="20" weight="thin" />
      </div>
    </div>
    <Transition name="panel">
      <div
        v-show="showDetl"
        :class="{ show: showDetl }"
        class="flex flex-col menu-detl-panel w-80 absolute top-0 text-gray-500 left-12 h-full bg-white border-l border-solid border-zinc-300 shadow-md"
        @click="() => (showDetl = !showDetl)"
      >
        <div class="flex flex-row justify-between items-center px-4 h-12">
          <span>组件库</span>
          <div>
            <PhResize :size="20" weight="thin" />
            <PhX :size="20" weight="thin" />
          </div>
        </div>
        <div class="px-4 py-3">
          <div
            class="border border-solid border-zinc-300 rounded flex flex-row h-7 items-center px-2"
          >
            <input
              type="text"
              class="border-0 flex-1"
              placeholder="搜索组件"
              @input.stop="searchEvt"
              @click.stop=""
            />
            <PhMagnifyingGlass :size="16" weight="thin" />
          </div>
        </div>
        <div class="flex flex-row text-center ui-tab">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1"
            :class="{ active: activeTab === tab.id }"
            @click.stop="() => (activeTab = tab.id)"
          >
            {{ tab.name }}
          </div>
        </div>
        <div
          v-for="group in comGroup"
          v-show="group.id === activeTab"
          :key="group.id"
          class="flex-1 overflow-auto"
        >
          <div v-for="(item, index) of group.children" :key="index">
            <div v-show="item.show">
              <div
                class="border-t border-solid border-zinc-300 h-10 flex flex-row justify-between items-center px-4"
              >
                <span>{{ item.name }}</span>
                <PhCaretDown
                  v-if="!item.open"
                  :size="16"
                  weight="thin"
                  @click.stop="
                    () => {
                      item.open = !item.open
                    }
                  "
                />
                <PhCaretUp
                  v-if="item.open"
                  :size="16"
                  weight="thin"
                  @click.stop="() => (item.open = !item.open)"
                />
              </div>
              <div
                v-if="item.open"
                class="grid ui-group border-t border-solid border-zinc-300 mr-1 pt-1"
                style="grid-template-columns: repeat(3, minmax(0, 1fr))"
              >
                <div
                  v-for="(child, cindex) of item.children"
                  v-show="child.show"
                  :key="cindex"
                  class="ui-item flex flex-col items-center justify-center text-center bg-orange-50 ml-1 mb-1 h-24 cursor-move"
                  :draggable="true"
                  @dragstart="
                    () => {
                      handleDragStart(child.type, null, child.props)
                      showDetl = false
                    }
                  "
                >
                  <div>
                    <component :is="child.icon" :size="30" weight="light" />
                    <div class="mt-2.5">{{ child.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { vDialog } from 'public-shared'
import {
  PhTreeView,
  PhPuzzlePiece,
  PhMagnifyingGlass,
  PhResize,
  PhX,
  PhCaretDown,
  PhCaretUp,
} from '@phosphor-icons/vue'
import tabDatas from './LeftMenu'
import { useDragStore } from '@/stores/dragStore'
const { handleDragStart } = useDragStore()
const { tabs, comGroup } = tabDatas
const text = ref('大纲树')
const text2 = ref('组件库')
const domTree = ref('domTree')
const comTree = ref('comTree')
const activeTab = ref('advance')
const showDetl = ref(false)
const searchEvt = function (e: any) {
  const searchText = e.target.value.trim()
  comGroup.value = comGroup.value.map((group) => {
    return {
      ...group,
      children: group.children.map((child) => {
        const items = child.children.map((item) => {
          return {
            ...item,
            show: item.name.toLowerCase().includes(searchText.toLowerCase()),
          }
        })
        const fitems = items.filter((item) => item.show)
        return {
          ...child,
          show: fitems.length > 0,
          children: items,
        }
      }),
    }
  })
}
//拖拽事件
const dragStart = (e: MouseEvent) => {
  console.log(e)
}
</script>
<style scoped>
.menu-list {
  position: relative;
  z-index: 3;
}
.menu-detl-panel {
  z-index: 999999;
}
/**组件面板动画设置*/
.panel-enter-active,
.panel-leave-active {
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
}
.panel-enter-from,
.panel-leave-to {
  transform: translateX(-20rem);
}
.panel-enter-to,
.panel-leave-from {
  transform: translateX(0);
}
.menu {
  line-height: 3rem;
  text-align: center;
}
.ui-group {
  transition-property: height;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  transition-duration: 0.5s;
}
/** .ui-group .ui-item:nth-child(3n + 1) {
  border-left: none;
}
.ui-group .ui-item:nth-last-child(-n + 3) {
  border-bottom: none;
}*/
.ui-tab > div {
  padding: 0.75rem 0;
  position: relative;
}
.ui-tab .active {
  color: rgb(253 186 116 / var(--tw-text-opacity, 1));
}
.ui-tab .active::after {
  content: '';
  display: inline-block;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 1px;
  background-color: rgb(253 186 116 / var(--tw-text-opacity, 1));
}
</style>
