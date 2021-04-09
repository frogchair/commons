export interface Mission {
  id: number;
  background: string;
  code: string;
  completed: boolean;
  missions: Mission[];
  rewardPreview: string;
  steps: number;
  title: string;
}
