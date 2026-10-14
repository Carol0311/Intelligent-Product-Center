// AI 能力编排（根据当前 schema 生成布局/表单等）
import { createNewComponent, createDefaultProps } from '@/domain/editor/treeManager'
import { generateUniqueId, COMPONENT_DEFAULT_PROPS } from 'public-shared'
import type { PageSchema, ComponentSchema, ComponentType, ColumnSchema } from 'public-shared'
export class AIAssistantService {
  private filedMapping: Record<string, any> = {}

  //生成固定品类的AI商品档案表单页面
  generateAIForm(
    schema: Record<string, any> | undefined,
    pageInfo: Record<string, any>,
  ): PageSchema | null {
    if (!schema) return null
    this.filedMapping = pageInfo.createTemplate
    const page = this.genenrateFormLayout(pageInfo)
    for (const field in schema) {
      const mapping = this.filedMapping[field]
      if (mapping) {
        const component = createNewComponent(mapping.layout_group, mapping.type, {
          label: mapping.label,
          id: field,
        })
        const { defaultChildren: _, ...filteredComponent } = component
        //加入组件映射
        page.components[component.id] = filteredComponent
        //加入分组tab映射
        page.components[mapping.layout_group].children.push(component.id)
      }
    }
    return page
  }

  //生成表单页面布局
  genenrateFormLayout(pageInfo: Record<string, any>) {
    const pageId = generateUniqueId('Page')
    const components = {} as Record<string, any>
    const rootComponent = this.createEmptyForm(null, 'EvelatorForm', {
      childProps: [
        { id: 'basic', tabTitle: `基础信息` },
        { id: 'b2b', tabTitle: `B2B` },
        { id: 'b2c', tabTitle: `B2C` },
        { id: 'detail', tabTitle: `详情信息` },
      ],
    })
    const saveButton = createNewComponent(null, 'Button', {
      service: 'save',
      label: '保存',
    })
    const { defaultChildren, ...filteredRoot } = rootComponent
    //根组件加入组件映射
    components[rootComponent.id] = filteredRoot
    components[saveButton.id] = saveButton
    //form的四个tab子组件加入组件映射
    defaultChildren.forEach((child) => {
      const { defaultChildren: _, ...filterChild } = child
      components[child.id] = filterChild
    })
    return {
      id: pageId,
      name: pageInfo.formName,
      pageId: pageInfo.formPageId,
      rootComponentIds: [saveButton.id, rootComponent.id],
      components,
    }
  }
  //创建默认商品档案表单模版
  createEmptyForm(parentId: string | null, type: ComponentType, props?: Record<string, any>) {
    const id = generateUniqueId(type)
    let children = []
    const defaultChildren = this.createDefaultChildren(id, type, props)
    children = defaultChildren.map((v) => v.id)
    return {
      id: props?.id || id,
      parentId,
      type,
      props: createDefaultProps(type, props),
      children,
      defaultChildren,
    }
  }
  //获取组件默认子组件
  createDefaultChildren(
    id: string,
    type: ComponentType,
    props?: Record<string, any>,
  ): ComponentSchema[] | any[] {
    switch (type) {
      case 'NormalForm':
        return []
      case 'EvelatorForm':
        return Array.from({ length: 4 }).map((v, i) =>
          this.createEmptyForm(id, 'NormalForm', { tabTitle: `tab${i}`, ...props?.childProps[i] }),
        )
      default:
        return []
    }
  }
  //生成固定品类的AI商品档案列表页面
  generateAIList(
    schema: Record<string, any> | undefined,
    pageInfo: Record<string, any>,
    tableConfig: Record<string, any>,
  ) {
    if (!schema) return null
    const columns = this.generateListColumns(schema, tableConfig.instanceId)
    const { tableId, ...layout } = this.generateListLayout(pageInfo, tableConfig, columns)
    return { template: layout, columns: columns, tableId, tableName: pageInfo.listName }
  }
  //生成默认商品档案列表
  generateListLayout(
    pageInfo: Record<string, any>,
    tableConfig: Record<string, any>,
    columns: any[],
  ) {
    const pageId = generateUniqueId('Page')
    const saveButton = createNewComponent(null, 'Button', {
      service: 'save',
      label: '保存',
    })
    const tableComponent = createNewComponent(null, 'HybirdTable', {
      tableConfig: {
        ...tableConfig,
        name: pageInfo.listName,
        columns,
      },
    })
    const components = { [saveButton.id]: saveButton, [tableComponent.id]: tableComponent }
    return {
      id: pageId,
      name: pageInfo.listName,
      pageId: pageInfo.listPageId,
      rootComponentIds: [saveButton.id, tableComponent.id],
      components,
      tableId: tableComponent.id,
    }
  }
  //生成商品档案列表列字段
  generateListColumns(schema: Record<string, any>, instanceId: string) {
    const columns: any[] = Array.from({ length: Object.keys(schema).length }, () => {})
    for (const key in schema) {
      const mapping = this.filedMapping[key]
      if (mapping) {
        columns[mapping.index] = {
          instanceId,
          name: mapping.label,
          type: mapping.type as ComponentType,
          key,
          props: { ...COMPONENT_DEFAULT_PROPS, inTable: true },
        } as ColumnSchema
      }
    }
    columns.push({
      instanceId,
      name: '操作',
      type: 'Operation' as ComponentType,
      key: 'operation',
      props: {
        ...COMPONENT_DEFAULT_PROPS,
        inTable: true,
        options: [{ name: '查看详情', service: 'view' }],
      },
    })
    return columns.filter((cc) => cc)
  }
}
export const AIAssistant = new AIAssistantService()
