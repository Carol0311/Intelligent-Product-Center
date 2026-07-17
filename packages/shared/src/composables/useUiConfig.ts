import { reactive, computed, toRaw } from 'vue'
// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { useEditorStore } from '@/stores/editorStore'
// #endif
// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore } from '@/stores/pageStore'
// #endif
import { UI_STATIC } from '@shared/composables/constant/uiClass'
// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { createDefaultProps } from '@/domain/editor/treeManager'
//#endif
import type { ColumnSchema, ComponentType } from '@shared/schema'
import { PhGear, PhXCircle, PhCalendar, PhToggleRight, PhCheckSquare, PhCheckCircle, PhCaretCircleDown } from '@phosphor-icons/vue'

/**组件交互状态*/
export interface UiState {
  isFocus: boolean
}

export const useUiConfig = (componentId?: string, column?: ColumnSchema, additionalProps?: Record<string, unknown>) => {
  // #if [PRODUCT]
  const pageStore = usePageStore()
  //@ts-ignore - 仅在product构建时存在
  const { findComponentById, updateComponent } = pageStore
  // #endif

  // #if [LOWCODE]
  const editorStore = useEditorStore()
  //@ts-ignore - 仅在lowcode构建时存在
  const { findComponentById, updateComponent } = editorStore
  // #endif

  const component = computed(() => {
    return column ? column : findComponentById(componentId!)
  })

  // #if [LOWCODE]
  const defaultProps = createDefaultProps(component.value?.type)
  // #endif
  const config = computed(() => {
    return column
      ? {
          ...column.props,
          // #if [LOWCODE]
          isLowCode: true,
          // #endif
          isChange: false,
        }
      : {
          // #if [LOWCODE]
          ...defaultProps,
          // #endif
          ...component.value?.props,
          // #if [LOWCODE]
          isLowCode: true,
          // #endif
          cid: component.value?.id,
          parent: component.value?.parentId,
          ...additionalProps,
          isChange: false,
        }
  })
  //初始化更新每个组件的属性值
  if (!column) {
    updateComponent(config.value.cid, config.value)
  }

  const parentCom = computed(() => {
    return column ? null : findComponentById(config.value.parent)
  })

  const state = reactive<UiState>({
    isFocus: false,
  })

  const uiByParent = {
    tabStatus: computed(() => parentCom.value?.props.tabStatus),
    labelPos: computed(() => {
      return parentCom.value?.props.labelPos || 'left'
    }),
    labelAlign: computed(() => parentCom.value?.props.labelAlign || 1),
  }

  const uiClass = {
    item: computed(() => ({
      'flex flex-row': uiByParent.labelPos.value === 'left',
      'text-center': uiByParent.labelPos.value === 'top',
    })),
    outLabel: computed(() => ({
      'text-left': !uiByParent.labelAlign.value && uiByParent.labelPos.value !== 'top',
      'text-right': uiByParent.labelAlign.value && uiByParent.labelPos.value !== 'top',
      'mb-0.5 text-center w-auto': uiByParent.labelPos.value === 'top',
    })),
    ctrl: computed(() => ({
      'flex-1': uiByParent.labelPos.value === 'left',
      'justify-center': uiByParent.labelPos.value === 'top',
    })),
    inputBox: computed(() => {
      return {
        'border border-solid': config.value.border,
        'w-full': uiByParent.labelPos.value !== 'inner',
        'inner-input': uiByParent.labelPos.value === 'inner',
        /**'smart-inputBox-hover': config.value.hover,
      'smart-inputBox-focus':
        state.isFocus && !config.value.disable && !config.value.readonly && uiByParent.tabStatus.value !== 0,*/
        'smart-inputBox-error': config.value.validateStatus === 0 || config.value.errTip,
        'smart-inputBox-warning': config.value.validateStatus === 3,
        'smart-inputBox-disable': config.value.disable,
        'smart-inputBox-readonly': uiByParent.tabStatus.value === undefined ? config.value.readonly : uiByParent.tabStatus.value === 0,
      }
    }),
    checkIcon: computed(() => ({
      'smart-checkbox-disable': config.value.disable,
      'smart-checkbox-readonly': uiByParent.tabStatus.value === undefined ? config.value.readonly : uiByParent.tabStatus.value === 0,
    })),
  }

  const uiEvents = {
    focus: () => {
      state.isFocus = true
    },
    blur: () => {
      state.isFocus = false
    },
    mouseOver: () => {
      config.value.hover = !config.value.disable && !config.value.readonly && uiByParent.tabStatus.value !== 0
    },
    mouseLeave: () => {
      config.value.hover = false
    },
    change: () => {
      //处理trim
    },
  }

  const resetState = () => {
    state.isFocus = false
  }
  const getIcon = (type: ComponentType) => {
    switch (type) {
      case 'Text':
      case 'TextArea':
        return config.value.clear ? PhXCircle : PhGear
      case 'SSelect':
        return config.value.clear ? PhXCircle : PhCaretCircleDown
      case 'Date':
      case 'DateRange':
        return config.value.clear ? PhXCircle : PhCalendar
      case 'Switch':
        return PhToggleRight
      case 'Radio':
      case 'RadioGroup':
        return PhCheckCircle
      case 'SCheckbox':
      case 'CheckboxGroup':
        return PhCheckSquare
      default:
        return PhGear
    }
  }

  return {
    config,
    state,
    uiClass,
    uiStatic: UI_STATIC,
    uiEvents,
    uiByParent,
    getIcon,
    resetState,
  }
}
