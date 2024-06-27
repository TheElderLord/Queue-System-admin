export interface Service {
  id: number
  name: string
  description: string
  parentName: string
  priority: number
  parentId: number | null
  maxServTime: number | null
  maxWaitTime: number | null
}
