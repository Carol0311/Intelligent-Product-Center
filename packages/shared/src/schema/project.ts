import type { PageSchema } from './page'

// project schema
export interface ProjectSchema {
  id: string
  name: string
  pages: Record<string, PageSchema>
  homePageId: string
}
