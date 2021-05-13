export interface Mission {
  id: number
  code: string
  title: string
  steps: number
  background?: string
  rewardPreview?: string
  status: MissionStatus
  missions?: Mission[]
}
export enum MissionStatus {
  completed = "completed",
  open = "open",
  locked = "locked"
}
