<template>
  <div class="history-wrapper absolute">
    <div class="gray-layer" @click.stop="closeHistory"></div>
    <div class="content-box bg-white absolute flex flex-col p-2.5">
      <div
        class="history-list flex-1"
        :class="{ 'flex items-center justify-center': historyList.length === 0 }"
      >
        <template v-if="historyList.length > 0">
          <div
            v-for="(history, index) in historyList"
            :key="history.session_id"
            class="history-item leading-6 px-2 py-1 text-gray-600 flex flex-row justify-between items-center cursor-pointer hover:bg-zinc-100 rounded"
          >
            <input
              type="text"
              class="max-w-32"
              :value="history.title || `未命名对话${Math.max(index, 1)}`"
              :readonly="disabledMap[history.session_id]"
              @click.stop="openCurrentChat(history)"
              @blur="(e) => renameChat(e, history)"
            />
            <div>
              <PhPencil
                :size="14"
                weight="thin"
                class="text-orange-300 mr-2"
                @click.stop="(e: MouseEvent) => editHistory(e, history)"
              />
              <PhTrash
                :size="14"
                weight="thin"
                class="text-zinc-400"
                @click.stop="deleteHistory(history)"
              />
            </div>
          </div>
        </template>
        <div v-else class="text-gray-500 text-center py-2">暂无历史会话</div>
      </div>
      <div class="user-info flex flex-row justify-between">
        <div></div>
        <PhSignOut :size="24" weight="duotone" class="text-zinc-400" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { PhSignOut, PhTrash, PhPencil } from '@phosphor-icons/vue'
import { deleteChat, updateChatTitle } from '@/infra/http/aiApi'

export interface HistoryInfo {
  session_id: string
  user_id: string
  title: string
}
const props = defineProps<{
  data: HistoryInfo[]
}>()

const emit = defineEmits(['close-history'])

const historyList = ref<HistoryInfo[]>([])
const disabledMap = ref<Record<string, boolean>>({})

watch(
  () => props.data,
  (newVal) => {
    historyList.value = newVal
    disabledMap.value = newVal.reduce(
      (map, item) => {
        map[item.session_id] = true
        return map
      },
      {} as Record<string, boolean>,
    )
  },
)

//关闭历史会话抽屉
const closeHistory = () => {
  emit('close-history')
}

//编辑对话标题
const editHistory = (e: MouseEvent, history: HistoryInfo) => {
  const target = e.target as HTMLElement
  const input = target.closest('.history-item')?.querySelector('input') as HTMLInputElement
  disabledMap.value[history.session_id] = false
  input?.focus()
}

//对话标题重命名
const renameChat = (e: MouseEvent, history: HistoryInfo) => {
  const name = (e.target as HTMLInputElement).value
  if (name.trim() === history.title) {
    disabledMap.value[history.session_id] = true
    return
  }
  updateChatTitle({
    userId: history.user_id,
    sessionId: history.session_id,
    updateData: { title: name },
  })
    .then((res) => {
      if (res.success) {
        historyList.value = historyList.value.map((item) => {
          if (item.session_id === history.session_id) {
            return {
              ...item,
              title: name,
            }
          }
          return item
        })
      }
    })
    .then(() => {
      disabledMap.value[history.session_id] = true
    })
}

const deleteHistory = (history: HistoryInfo) => {
  console.log('删除历史会话', history)
  deleteChat({ userId: history.user_id, sessionId: history.session_id }).then((res) => {
    if (res.success) {
      historyList.value = historyList.value.filter((item) => item.session_id !== history.session_id)
      if (localStorage.getItem('session-id') === history.session_id) {
        localStorage.removeItem('session-id')
      }
    }
  })
}

//打开当前历史会话
const openCurrentChat = (history: HistoryInfo) => {
  //只要有一个对话还在重命名编辑状态，就不触发事件处理
  const isEditing = Object.values(disabledMap.value).find((v) => !v)
  if (isEditing === undefined) {
    //关闭历史会话列表，同时请求当前历史会话数据
    emit('close-history', history)
  }
}
</script>
<style scoped>
.history-wrapper {
  position: absolute;
  z-index: 12;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.gray-layer {
  position: absolute;
  z-index: 14;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.1);
}
.history-wrapper .content-box {
  left: 0;
  right: 30%;
  bottom: 0;
  top: 0;
  z-index: 20;
  animation: left-to-right 0.3s linear;
}
@keyframes left-to-right {
  0% {
    right: 100%;
  }
  30% {
    right: 70%;
  }
  60% {
    right: 50%;
  }
  100% {
    right: 30%;
  }
}
</style>
