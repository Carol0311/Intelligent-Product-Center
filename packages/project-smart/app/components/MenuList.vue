<template>
  <div class="bg-white w-20 text-zinc-600">
    <Menu v-for="m in menuData" :data="m" :key="m.label" />
  </div>
</template>
<script setup lang="ts">
type IconNames = 'PhHouse' | 'PhNotebook' | 'PhList'
let menuData = ref([
  {
    icon: 'PhHouse',
    label: 'home',
    name: '首页',
    path: '/',
  },
  {
    icon: 'PhNotebook',
    label: 'goods',
    name: '商品档案',
    path: '/goods',
  },
  {
    icon: 'PhList',
    label: 'goodsList',
    name: '商品档案列表',
    path: '/goodsList',
  },
])
</script>
