// AI 能力编排（根据当前 schema 生成布局/表单等）
import { createNewComponent, createDefaultProps } from '@/domain/editor/treeManager'
import { generateUniqueId, COMPONENT_DEFAULT_PROPS } from 'public-shared'
import type { PageSchema, ComponentSchema, ComponentType, ColumnSchema } from 'public-shared'
export class AIAssistantService {
  private filedMapping: Record<string, any> = {
    product_name: { type: 'Text', index: 0, label: '商品名称', layout_group: 'basic' },
    category: { type: 'SSelect', index: 1, label: '商品分类', layout_group: 'basic' },
    brand: { type: 'Text', index: 2, label: '品牌', layout_group: 'basic' },
    price: { type: 'Price', index: 3, label: '销售价', layout_group: 'basic' },
    sku: { type: 'Text', index: 4, label: '规格信息', layout_group: 'basic' },
    b2bOrderUnit: { type: 'SSelect', index: 5, label: 'B2B订货单位', layout_group: 'b2b' },
    b2bOrderCtrl: { type: 'SCheckbox', index: 6, label: 'B2B订货控制', layout_group: 'b2b' },
    minOrderQuantity: { type: 'Number', index: 7, label: '最小订货量', layout_group: 'b2b' },
    incrementUnit: { type: 'Number', index: 8, label: '单位增量', layout_group: 'b2b' },
    maxOrderQuantity: { type: 'Number', index: 9, label: '最大订货量', layout_group: 'b2b' },
    isLaunch: { type: 'SCheckbox', index: 10, label: '是否上架', layout_group: 'b2c' },
    rebate: { type: 'Number', index: 11, label: '折扣', layout_group: 'b2c' },
    pictureDetail: { type: 'Image', index: 12, label: '图片详情', layout_group: 'detail' },
    descDetail: { type: 'TextArea', index: 13, label: '商品详情', layout_group: 'detail' },
    additionInfo: { type: 'TextArea', index: 14, label: '补充信息', layout_group: 'detail' },
  }

  //生成固定品类的AI商品档案表单页面
  generateAIForm(
    schema: Record<string, any> | undefined,
    pageInfo: Record<string, any>,
  ): PageSchema | null {
    if (!schema) return null
    const page = this.genenrateFormLayout(pageInfo)
    for (const field in schema) {
      const mapping = this.filedMapping[field]
      if (mapping) {
        const component = createNewComponent(mapping.layout_group, mapping.type, {
          label: mapping.label,
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
    const { defaultChildren, ...filteredRoot } = rootComponent
    //根组件加入组件映射
    components[rootComponent.id] = filteredRoot
    //form的四个tab子组件加入组件映射
    defaultChildren.forEach((child) => {
      const { defaultChildren: _, ...filterChild } = child
      components[child.id] = filterChild
    })
    return {
      id: pageId,
      name: pageInfo.formName,
      pageId: pageInfo.formPageId,
      rootComponentIds: [rootComponent.id],
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
    const columns = this.generateListColumns(schema)
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
    const tableComponent = createNewComponent(null, 'HybirdTable', {
      ...tableConfig,
      columns,
      name: pageInfo.listName,
    })
    const components = { [tableComponent.id]: tableComponent }
    return {
      id: pageId,
      name: pageInfo.listName,
      pageId: pageInfo.listPageId,
      rootComponentIds: [tableComponent.id],
      components,
      tableId: tableComponent.id,
    }
  }
  //生成商品档案列表列字段
  generateListColumns(schema: Record<string, any>) {
    const columns: any[] = Array.from({ length: Object.keys(schema).length }, () => {})
    for (const key in schema) {
      const mapping = this.filedMapping[key]
      if (mapping) {
        columns[mapping.index] = {
          name: mapping.label,
          type: mapping.type as ComponentType,
          key,
          props: { ...COMPONENT_DEFAULT_PROPS, inTable: true },
        } as ColumnSchema
      }
    }
    return columns.filter((cc) => cc)
  }
}
export const AIAssistant = new AIAssistantService()
