export interface Mission {
  id: number
  code: string
  title: string
  steps: number
  background?: string
  completed: boolean
  rewardPreview?: string
  missions?: Mission[]
}
