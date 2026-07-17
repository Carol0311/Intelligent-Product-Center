//组件注册表：type → Vue 组件
import type { Component } from 'vue'
import * as UnitUI from '@shared/components/UnitUI'
import * as ToolUI from '@shared/components/ToolUI'
import * as TableUI from '@shared/components/TableUI'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentType, ComponentSchema } from '@shared/schema/component'

const registry: Partial<Record<ComponentType, Component | String>> = {
  FormItem: FormItem,

  Text: UnitUI.Text,
  Date: UnitUI.Date,
  DateRange: UnitUI.DateRange,
  SSelect: UnitUI.SSelect,
  Switch: UnitUI.Switch,
  Tips: ToolUI.Tips,
  Number: UnitUI.Number,
  Price: UnitUI.Price,
  Qty: UnitUI.Qty,
  Radio: UnitUI.Radio,
  RadioGroup: UnitUI.RadioGroup,
  SCheckbox: UnitUI.SCheckbox,
  CheckboxGroup: UnitUI.CheckboxGroup,
  TextArea: UnitUI.TextArea,
  Upload: UnitUI.Upload,
  Address: UnitUI.Address,
  Image: UnitUI.Image,
  Button: UnitUI.Button,
  MenuButton: UnitUI.MenuButton,
  ButtonGroup: UnitUI.ButtonGroup,
  Search: UnitUI.Search,
  Filter: UnitUI.Filter,
  CategorySearch: UnitUI.CategorySearch,
  Operation: UnitUI.Operation,

  HybirdTable: TableUI.HybirdTable,

  /**Container: 'Container' as ComponentType,
  AdvanceForm: 'AdvanceForm' as ComponentType,
  EvelatorForm: 'EvelatorForm' as ComponentType,
  NormalForm: 'NormalForm' as ComponentType,*/
}
export const componentRegistry = {
  get(type: ComponentType): Component | String {
    try {
      return registry[type] || 'Container'
    } catch (e) {
      console.log('找不到目标组件', e)
      return 'Container'
    }
  },
  register(type: ComponentType, component: Component) {
    registry[type] = component
  },
  initContainer(components: Record<string, any>[]) {
    components.forEach(({ name, component }) => {
      //console.log(component)
      registry[name as ComponentType] = component
    })
  },
  has(type: ComponentType): boolean {
    return type in registry
  },
}
