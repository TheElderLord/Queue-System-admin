export interface Branch {
  id: number
  name: string
  description: string
  parentId: number | null
  parentName: string,
  lat:number,
  lng:number
}
