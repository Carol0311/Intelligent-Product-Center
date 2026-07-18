<template>
  <NuxtLink :to="data.path" class="hover:text-orange-300 flex flex-col items-center justify-center h-20" activeClass="text-orange-300">
    <component :is="dynamicIcon" weight="duotone" size="24" />
    <span class="text-xs">{{ data.name }}</span>
  </NuxtLink>
</template>
<script setup lang="ts">
import { PhHouse, PhNotebook, PhList, PhNut } from '@phosphor-icons/vue'
const IconMap = {
  PhHouse,
  PhNotebook,
  PhList,
} as const
const props = defineProps<{
  data: {
    icon: string
    label: string
    name: string
    path: string
  }
}>()
const dynamicIcon = IconMap[props.data.icon as keyof typeof IconMap] || PhNut

/**
//动态导入图标方案 
const menuIcons = ['PhHouse','PhNotebook','PhList']
menuIcons.forEach((icon)=>{
    IconCache.set(icon,module[icon as keyof typeof module])
})
/**onMounted(async ()=>{
    if(IconCache.size === 0){
        const module = await import('@phosphor-icons/vue')
        menuIcons.forEach((icon)=>{
            IconCache.set(icon,module[icon as keyof typeof module])
        })
    }
})
const dynamicIcon = computed(()=>{
    return IconCache.get(props.data.icon) || defineAsyncComponent(()=>
        import('@phosphor-icons/vue').then(module=>{
            const IconCom = module[props.data.icon as keyof typeof module]
            IconCache.set(props.data.icon,IconCom)
            return IconCom
        })
    )
})*/
</script>
