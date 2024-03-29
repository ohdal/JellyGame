import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { MyAudio } from "../types";

const Wrapper = styled.div`
  position: relative;
  width: 30px;
  min-height: inherit;
  border: 3px solid #66a7ba;
  border-radius: 4px;
  margin-left: 20px;
`;

const TimerInner = styled.div`
  width: 24px;
  position: absolute;
  background: #66a7ba;
  bottom: 0;
`;

interface Props {
  playCnt: number;
  changeIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  audio: MyAudio;
}

const TIME_VALUE = 150;
let time = TIME_VALUE;
let intervalId: NodeJS.Timer | null = null;

const Timer = (props: Props) => {
  const { playCnt, changeIsGameOver, audio } = props;
  const [timerHeight, setTimerHeight] = useState<number | null>(null); // <TImerInner/> height 값 number

  const timerDiv = useRef<HTMLDivElement>(null);

  // 기능 : 타이머 reset
  // 인자 : 없음
  const resetTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }, []);

  // 역할 : 타이머 interval 설정
  useEffect(() => {
    time = TIME_VALUE;

    if (timerDiv.current) {
      const height = timerDiv.current.clientHeight;
      const value = height / time;
      setTimerHeight(height);

      intervalId = setInterval(() => {
        time--;
        setTimerHeight(value * time);
        if (time === 0) {
          resetTimer();
          audio.resetAudio();
          changeIsGameOver(true);
        } else if (time === 60) {
          audio.changeRate(1.25);
        } else if (time === 30) {
          audio.changeRate(1.5);
        }
      }, 1000);
    }

    return () => {
      resetTimer();
    };
  }, [playCnt, changeIsGameOver, resetTimer, audio]);

  return (
    <Wrapper ref={timerDiv}>
      <TimerInner style={{ height: `${timerHeight}px` }} />
    </Wrapper>
  );
};

export default React.memo(Timer);
// export default Timer;
