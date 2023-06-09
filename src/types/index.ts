export type ChangeVolume = (volume: number) => void;
export type ChangeRate = (rate: number) => void;

export interface MyAudio {
  playAudio: () => void;
  resetAudio: () => void;
  changeVolume: ChangeVolume;
  changeRate: ChangeRate;
}

