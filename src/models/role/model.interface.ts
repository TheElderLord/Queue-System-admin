import type { RoleService } from "../role-services/role-service.interface"
// import type { Service } from "../services/services.interface"
export interface RoleModel {
  id: number
  name: string
  description: string
  priority: number,
  show:boolean,
  roleServices:RoleService[]
}
