import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { ChangeVolume } from "../types";

interface Props {
  playCnt: number;
  changeIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  changeMusicRate: ChangeVolume;
  resetMusic: () => void;
}

const Wrapper = styled.div<{ ref: React.RefObject<HTMLDivElement> }>`
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

const TIME_VALUE = 150;
let time = TIME_VALUE;
let intervalId: NodeJS.Timer | null = null;

const Timer = (props: Props) => {
  const { playCnt, changeIsGameOver, changeMusicRate, resetMusic } = props;
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
          resetMusic();
          changeIsGameOver(true);
        } else if (time === 60) {
          changeMusicRate(1.25);
        } else if (time === 30) {
          changeMusicRate(1.5);
        }
      }, 1000);
    }

    return () => {
      resetTimer();
    };
  }, [playCnt, changeIsGameOver, changeMusicRate, resetTimer, resetMusic]);

  return (
    <Wrapper ref={timerDiv}>
      <TimerInner style={{ height: `${timerHeight}px` }} />
    </Wrapper>
  );
};

export default React.memo(Timer);
// export default Timer;
