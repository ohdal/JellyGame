import { MyAudio } from "../types";

class CustomAudio implements MyAudio {
  private audio: HTMLAudioElement;

  constructor(src: string, volume: number = 1, loop: boolean = false) {
    this.audio = new Audio(src);
    this.audio.volume = volume;
    this.audio.loop = loop;
  }

  playAudio(): void {
    this.audio.play();
  }

  resetAudio(): void {
    this.audio.pause();
    this.audio.playbackRate = 1.0;
    this.audio.currentTime = 0;
  }

  changeVolume(volume: number): void {
    this.audio.volume = volume;
  }

  changeRate(rate: number): void {
    this.audio.playbackRate = rate;
  }
}

export default CustomAudio;
