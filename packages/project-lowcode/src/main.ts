import './assets/css/lowcode.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import {
  componentRegistry,
  Container,
  Panel,
  AdvanceForm,
  EvelatorForm,
  NormalForm,
} from 'public-shared'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//提前注册容器组件，避免循环引用
componentRegistry.initContainer([
  { name: 'Container', component: Container },
  { name: 'AdvanceForm', component: AdvanceForm },
  { name: 'EvelatorForm', component: EvelatorForm },
  { name: 'NormalForm', component: NormalForm },
  { name: 'Panel', component: Panel },
])

app.mount('#app')
