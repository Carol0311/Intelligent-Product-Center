import { toRaw } from 'vue'

export const deepClone = (arg: any, hash = new WeakMap()) => {
  //待拷贝数据为null/undefined 原值返回
  if (arg === null || arg === undefined) return arg
  //Date/RegExp类型 返回类型实例
  if (arg instanceof Date) return new Date(arg)
  if (arg instanceof RegExp) return new RegExp(arg)
  //待拷贝数据为基础类型，返回基础类型的拷贝
  if (typeof arg !== 'object') return arg
  //避免重复
  if (hash.get(arg)) return hash.get(arg)
  //待拷贝数据为对象类型
  if (typeof arg === 'object') {
    const result = new arg.constructor()
    hash.set(arg, result)
    for (const key in arg) {
      if (arg.hasOwnProperty(key)) {
        //递归拷贝
        result[key] = deepClone(arg[key], hash)
      }
    }
    return result
  }
}
// 深度递归解包所有嵌套对象
export const deepToRaw = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj

  const raw = toRaw(obj)

  if (Array.isArray(raw)) {
    return raw.map((item) => deepToRaw(item)) as T
  }

  const result: any = {}
  for (const key in raw) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      result[key] = deepToRaw(raw[key])
    }
  }
  return result
}
// 生成组件唯一id的方法
export const generateUniqueId = (name: string): string => {
  // 采用当前时间戳+随机数的方式生成唯一字符串
  return name + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9)
}
//generateId函数的简单实现
export const generateId = (): string => {
  return 'id_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
//检测当前设备是否在移动端
export const isMobile = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 'ontouchstart' in window
}
//检测移动端是否有摄像头
export const hasCamera = async () => {
  if (isMobile() && 'mediaDevice' in navigator) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.some((device) => device.kind === 'videoinput')
    } catch (e) {
      console.log(e)
      return false
    }
  }
  return false
}
//通用文件验证
export const isValidateFile = (file: any, acceptList: string): boolean => {
  const acceptTypes = acceptList.split(',')
  acceptTypes.some((type) => {
    if (type.match(/\/*/)) {
      const category = type.split('/')[0]
      return file.type.startsWith(category)
    }
    return file.type === type || file.name.toLowerCase().endsWith(type.replace('.', ''))
  })
  return false
}
//日期格式化
export const formatDate = (date: number, format = 'yyyy-MM-dd'): string => {
  let result = ''
  const d = new Date(date)

  result = format.replace('yyyy', d.getFullYear() + '')
  result = result.replace('MM', ('0' + (d.getMonth() + 1)).slice(-2))
  result = result.replace('dd', ('0' + d.getDate()).slice(-2))

  result = result.replace('HH', ('0' + d.getHours()).slice(-2))
  result = result.replace('mm', ('0' + d.getMinutes()).slice(-2))
  result = result.replace('ss', ('0' + d.getSeconds()).slice(-2))

  return result
}
export const formatDateRange = (date: number[]): string => {
  const result = []

  result.push(formatDate(date[0]!))
  result.push(formatDate(date[1]!))

  return result.join('-')
}
