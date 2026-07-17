import type { ComponentType, ComponentProps } from './component'

export interface ColumnSchema {
  id?: string
  parentId?: string
  name: string
  type: ComponentType
  key: string
  props: ComponentProps
  /**editable: boolean
  hidden: boolean
  disable: boolean
  inTable: true
  align: 'left' | 'center' | 'right'
  alignFixed?: 'left' | 'none' | 'right'
  desc?: string
  sort?: boolean
  search?: boolean
  filter?: boolean*/
}
