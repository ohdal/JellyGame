import { ForwardedRef, MutableRefObject } from "react";

export type ChangeVolume = (volume: number) => void;
export type ChangeRate = (rate: number) => void;

export interface MyAudio {
  playAudio: () => void;
  resetAudio: () => void;
  changeVolume: ChangeVolume;
  changeRate: ChangeRate;
}

export interface BearList {
  visible: boolean;
  value: number;
  src: string;
}

export type HowToModalContext = MutableRefObject<ForwardedRef<HTMLDivElement>> | null