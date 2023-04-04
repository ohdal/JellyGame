import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';

import music_background from '../assets/media/music_background.mp3'

const Wrapper = styled.div`
  position: relative;
  width: 30px;
  min-height: inherit;
  border: 3px solid #66a7ba;
  border-radius: 4px;
  margin-left: 20px;
`;

const TimerInner = styled.div`
  width: inherit;
  position: absolute;
  background: #66a7ba;
  bottom: 0;
`;

const TIME_VALUE = 150;
const musicAudio = new Audio(music_background);
let time = TIME_VALUE;
let intervalId = null;

musicAudio.loop = true;
musicAudio.volume = 0.2;

const resetMusic = () => {
  musicAudio.pause();
  musicAudio.playbackRate = 1.0;
  musicAudio.currentTime = 0;
}

const Timer = (props) => {
  const { playCnt, changeIsGameOver, } = props;
  const [timerHeight, setTimerHeight] = useState(null);

  const timerDiv = useRef();

  useEffect(() => {
    time = TIME_VALUE;

    if (intervalId) {
      clearInterval(intervalId);
      resetMusic();
    }

    musicAudio.play();
    const height = timerDiv.current.clientHeight;
    const value = height / time;
    setTimerHeight(height);

    intervalId = setInterval(() => {
      time--;
      setTimerHeight(value * time);
      if (time === 0) {
        clearInterval(intervalId);
        intervalId = null;
        changeIsGameOver(true);
        resetMusic();
      } else if (time === 60) {
        musicAudio.playbackRate = 1.25;
      } else if (time === 30) {
        musicAudio.playbackRate = 1.5;
      }
    }, 1000)

    return () => {
      resetMusic();
    }
  }, [playCnt, changeIsGameOver])

  return (
    <Wrapper ref={timerDiv}>
      <TimerInner style={{ height: `${timerHeight}px` }} />
    </Wrapper>
  )
}

export default Timer;