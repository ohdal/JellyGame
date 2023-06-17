export type ChangeVolume = (volume: number) => void;

export interface MyAudio {
  playAudio: () => void;
  resetAudio: () => void;
  changeVolume: ChangeVolume;
  changeRate: (rate: number) => void;
}