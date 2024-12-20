import type { windowServiceModelDtos } from "./window-service.interface"

export interface Window {
  id: number,
  branchId: number | undefined | null,
  branchName: string | undefined | null,
  number: number | undefined | null,
  name: string | undefined | null,
  description: string | undefined | null,
  active: boolean | undefined | null,
  show: boolean | undefined | null
  windowServiceModelDtos: windowServiceModelDtos[] | undefined | null
}
