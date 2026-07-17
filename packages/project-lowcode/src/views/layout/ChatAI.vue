<template>
  <div class="chat-wrapper flex flex-col fixed bg-white w-80">
    <div class="chat-title inline-flex items-center h-10 shadow">
      <PhArrowCircleLeft :size="24" weight="duotone" class="text-orange-300" @click="stopChat" />
      <PhListStar :size="24" weight="duotone" class="text-orange-300" @click="handleHistory" />
      <div class="flex-1 text-center">对话标题</div>
      <PhPlusCircle :size="24" weight="duotone" class="text-orange-300" @click="startChatEvt" />
    </div>
    <div
      ref="msgWrapper"
      class="message-wrapper flex flex-col flex-1 p-2.5 text-gray-600 overflow-auto"
    >
      <div v-if="messageList && messageList.length === 0" class="text-center m-auto">
        <div
          class="robot-icon inline-block w-20 h-20 bg-orange-100 flex items-center justify-center m-auto"
        >
          <PhRobot :size="36" weight="duotone" class="text-orange-300" />
        </div>
        <pre class="leading-6 mt-2.5">{{ systemAsk }}</pre>
      </div>
      <template v-if="messageList && messageList.length > 0">
        <div
          v-for="(msg, index) in messageList"
          :key="index"
          :class="{ 'text-left': msg.role === 'assistant', 'text-right': msg.role === 'user' }"
          class="flex flex-col"
        >
          <div>
            <PhRobot
              v-show="msg.role === 'assistant'"
              :size="30"
              weight="duotone"
              class="text-orange-300"
            />
            <PhUserCircleGear
              v-show="msg.role === 'user'"
              :size="30"
              weight="duotone"
              class="text-blue-500"
            />
          </div>
          <div class="my-2.5 msg-content" :class="msg.role">{{ msg.content }}</div>
        </div>
      </template>
    </div>
    <PhCaretCircleDoubleDown
      v-show="showToBottom"
      :size="24"
      class="fixed msg-to-bottom text-orange-300 bg-white rounded-full cursor-pointer"
      @click="toBottom"
    />
    <div v-if="isCompleted" class="flex flex-row justify-center items-center text-center my-3">
      <div
        class="leading-7 border border-solid border-orange-300 text-orange-300 bg-orange-100 px-3 rounded-3xl mr-4"
        :form-id="formId"
        @click="openCurrentForm(formId)"
      >
        查看商品档案
      </div>
      <div
        class="leading-7 border border-solid border-orange-300 text-orange-300 bg-orange-100 px-3 rounded-3xl"
        @click="openCurrentList(listId)"
      >
        查看商品档案列表
      </div>
    </div>
    <div v-else class="input-wrapper flex flex-row items-center h-24 m-2.5">
      <textarea
        ref="userQst"
        type="text"
        class="flex-1 h-full p-2 resize-none text-gray-600"
        @keypress="keyEvt"
      />
      <PhArrowCircleUp
        :size="24"
        weight="duotone"
        class="text-orange-300"
        :class="{ 'opacity-30 cursor-not-allowed': isPending }"
        @click="sendMessage"
      />
    </div>
    <ChatHistory
      v-show="showHistory"
      :data="sessionHistoryList"
      @close-history="(history) => handleCloseHistory(history)"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import {
  PhArrowCircleUp,
  PhPlusCircle,
  PhListStar,
  PhArrowCircleLeft,
  PhRobot,
  PhUserCircleGear,
  PhCaretCircleDoubleDown,
} from '@phosphor-icons/vue'
import { ChatHistory } from '@/views/layout'
import { startChat, continueChat, getChat, getChatHistoryList } from '@/infra/http/aiApi'
import { AIAssistant } from '@/application/ai/aiAssistantService'
import { getPageDetail, ReplyData, savePage, initTableConfig, upsertRow } from 'public-shared'
import type { PageSchema } from 'public-shared'
import { useEditorStore } from '@/stores'

export interface MessageInfo {
  role: string
  content: string
}
export interface HistoryInfo {
  session_id: string
  user_id: string
  title: string
}

const emit = defineEmits(['close-chat'])

const systemAsk = '您好！我是智能商品助手\n请告诉我您想创建什么品类的商品？\n如:[手机,服饰,食品]等'

const showHistory = ref(false)
const showToBottom = ref(false)

const userQst = ref<HTMLInputElement | null>(null)
const msgWrapper = ref<HTMLElement | null>(null)

//AI回复返回前禁止信息再发送
const isPending = ref(false)
//AI生成商品档案流程是否结束
const isCompleted = ref(false)
//品类模版关键信息
const initTemplate = ref<any | null | undefined>(null)
//AI流程生成的品类模版id
const formId = ref<Record<string, any> | null>(null)
//AI流程生成的商品档案列表id
const listId = ref<Record<string, any> | null>(null)

const messageList = ref<MessageInfo[]>([])
const sessionHistoryList = ref<any[]>([])

const sessionId = ref('')
const userId = ref('')
const receivedInfo = ref<ReplyData>()

const editorStore = useEditorStore()
const { setCurrentPage } = editorStore

onMounted(() => {
  if (localStorage.getItem('user-id')) {
    userId.value = localStorage.getItem('user-id')!
  } else {
    userId.value = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem('user-id', userId.value)
  }

  //每次打开都是新对话窗口
  sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  localStorage.setItem('session-id', sessionId.value)
})

//聊天消息框回到顶部
const toTop = () => {
  msgWrapper.value!.scrollTop = 0
}
//聊天消息框滑到底部
const toBottom = () => {
  const dh = msgWrapper.value!.scrollHeight - msgWrapper.value!.clientHeight
  showToBottom.value = dh > 0
  msgWrapper.value!.scrollTop = Math.max(dh, 0)
}

//关闭会话窗口
const stopChat = () => {
  emit('close-chat')
}
//新建会话窗口
const startChatEvt = () => {
  sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  localStorage.setItem('session-id', sessionId.value)
  startChat({ userId: userId.value, sessionId: sessionId.value }).then((res) => {
    if (res.success && res.data) {
      receivedInfo.value = res.data
      messageList.value = []
      showToBottom.value = false
      isCompleted.value = false
      isPending.value = false
      initTemplate.value = null
      formId.value = null
      listId.value = null
    }
  })
}

//会话输入框enter键发送消息事件
const keyEvt = (e: KeyboardEvent) => {
  if (e.code === 'Enter' && !e.ctrlKey) {
    sendMessage()
  }
}
//多轮会话
const sendMessage = () => {
  if (isPending.value) return
  isPending.value = true
  const qstMsg = userQst.value?.value
  userQst.value!.value = ''
  messageList.value.push({ role: 'user', content: qstMsg! })
  try {
    continueChat({ userId: userId.value, sessionId: sessionId.value, userInput: qstMsg })
      .then((res) => {
        isPending.value = false
        if (res.success && res.data) {
          receivedInfo.value = res.data
          messageList.value.push({
            role: 'assistant',
            content: res.data!.reply,
          })
          isCompleted.value = Boolean(res.data.completed)
          initTemplate.value = res.data.templateInit
        }
      })
      .then(async () => {
        toBottom()
        if (isCompleted.value) {
          if (initTemplate.value) {
            await initAITemplate()
          }
          upsertAIFormData(receivedInfo.value?.schema)
        }
      })
  } catch (e: any) {
    isPending.value = false
    console.error('对话信息发送出错', e.message)
  }
}

//打开历史会话抽屉
const handleHistory = () => {
  showHistory.value = true
  getChatHistoryList({ userId: userId.value }).then((res) => {
    if (res.success && res.data) {
      sessionHistoryList.value = res.data.list
    }
  })
}
//历史会话抽屉关闭处理
const handleCloseHistory = (history: HistoryInfo) => {
  showHistory.value = false
  if (history) {
    //打开目标对话记录
    getChat({ userId: history.user_id, sessionId: history.session_id })
      .then(async (res) => {
        if (res.success && res.data) {
          const mlist = res.data.messages || []
          messageList.value = mlist.filter((m) => m.role !== 'system')
          isCompleted.value = Boolean(res.data.session.is_completed)
          if (isCompleted.value) {
            initTemplate.value = {
              categoryKey: 'phone',
              formPageId: `AI_GOODSFORM_CATEGORY_phone`,
              formName: `AI商品档案_手机_品类`,
              listPageId: `AI_GOODSLIST_CATEGORY_phone`,
              listName: `AI商品档案列表_手机_品类`,
            }
            if (initTemplate.value) {
              await initAITemplate(res.data.params, history.session_id)
            }
            upsertAIFormData(res.data.params)
          }
          if (isCompleted.value && res.data.formId) {
            formId.value = { id: res.data.formId }
          }
        }
      })
      .then(() => {
        toBottom()
      })
  } else {
    if (!localStorage.getItem('session-id')) {
      //原对话记录删除，也没有点击其他对话记录,则新建一个对话
      startChatEvt()
    }
    //否则继续使用当前对话记录
  }
}
const initAITemplate = async (schema?: Record<string, any>, session_id?: string) => {
  //初次生成AI特定品类的商品档案模版
  const test_schema = receivedInfo.value?.schema || schema
  const test_session = session_id || sessionId.value
  const pageTemplate = AIAssistant.generateAIForm(test_schema, initTemplate.value)

  if (!pageTemplate) return
  await savePage(pageTemplate).then((res) => {
    if (res.success && res.data) {
      console.log('AI生成的${test_schema.category}品类商品档案模版已成功存储', res.data.id)
      formId.value = {
        id: res.data.id,
        rowCode: `AI_${initTemplate.value.categoryKey}`,
        rowName: `AI_${test_schema?.category}`,
      }
    }
  })
  //初次生成AI特定品类的商品档案列表
  const tableConfig = {
    instanceId: `AI_${initTemplate.value.categoryKey}_instance`,
    source: 'ai',
    session_id: test_session,
  }
  const list = AIAssistant.generateAIList(test_schema, initTemplate.value, tableConfig)
  if (!list) return
  const { template } = list
  //将商品档案列表页面存入数据库
  await savePage(template).then((res) => {
    if (res.success && res.data) {
      console.log('AI生成的${test_schema.category}品类商品档案列表已成功存储', res.data.id)
      listId.value = {
        id: res.data.id,
        pageId: res.data.pageId,
        instanceId: tableConfig.instanceId,
      }
    }
  })
}
//插入AI流生成的商品档案数据
const upsertAIFormData = async (schema: Record<string, any> | undefined) => {
  if (!schema) return
  await upsertRow({
    rowData: {
      instanceId: listId.value?.instanceId,
      rowCode: formId.value?.rowCode,
      rowName: formId.value?.rowName,
      data: schema,
    },
  }).then((res) => {
    if (res.success && res.data) {
      console.log('AI生成的商品档案数据插入列表成功')
    }
  })
}
//打开商品档案表单
const openCurrentForm = (formId: Record<string, any> | null) => {
  if (!formId) return
  getPageDetail({ id: formId.id }).then((res) => {
    if (res.success && res.data) {
      setCurrentPage({ ...res.data, isSaved: undefined })
    }
  })
}
//打开商品档案列表
const openCurrentList = (listId: Record<string, any> | null) => {
  if (!listId) return
  getPageDetail({ id: listId.value.id }).then((res) => {
    if (res.success && res.data) {
      setCurrentPage({ ...res.data, isSaved: undefined })
    }
  })
}
</script>
<style scoped>
.chat-wrapper {
  bottom: 0;
  top: 38px;
  z-index: 10;
  animation: right-to-left 0.4s linear forwards;
  animation-play-state: paused;
}
.chat-wrapper.show {
  animation-play-state: running;
  animation-direction: normal;
}
.chat-wrapper.hide {
  animation-play-state: running;
  animation-direction: reverse;
  animation-fill-mode: forwards;
}
.message-wrapper .assistant {
  padding-right: 30%;
  text-align: left;
}
.message-wrapper .user {
  padding-left: 30%;
  text-align: right;
}
.input-wrapper {
  border-radius: 20px 20px 0 0;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}
.robot-icon {
  border-radius: 100%;
}
.msg-content {
  white-space: pre-wrap;
}
.msg-to-bottom {
  right: 1rem;
  bottom: 9rem;
}
@keyframes right-to-left {
  0% {
    transform: translateX(20rem);
  }
  25% {
    transform: translateX(15rem);
  }
  50% {
    transform: translateX(10rem);
  }
  75% {
    transform: translateX(5rem);
  }
  100% {
    transform: translateX(-5rem);
  }
}
</style>
