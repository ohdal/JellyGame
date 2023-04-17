import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components';

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

const TIME_VALUE = 150;
let time = TIME_VALUE;
let intervalId = null;

const Timer = (props) => {
  const { playCnt, changeIsGameOver, changeMusicRate, resetMusic } = props;
  const [timerHeight, setTimerHeight] = useState(null); // <TImerInner/> height 값 number

  const timerDiv = useRef();

  // 기능 : 타이머 reset
  // 인자 : 없음
  const resetTimer = useCallback(() => {
    clearInterval(intervalId);
    intervalId = null;
    resetMusic();
  }, [resetMusic])

  // 역할 : 타이머 interval 설정
  useEffect(() => {
    time = TIME_VALUE;

    const height = timerDiv.current.clientHeight;
    const value = height / time;
    setTimerHeight(height);

    intervalId = setInterval(() => {
      time--;
      setTimerHeight(value * time);
      if (time === 0) {
        resetTimer();
        changeIsGameOver(true);
      } else if (time === 60) {
        changeMusicRate(1.25);
      } else if (time === 30) {
        changeMusicRate(1.5);
      }
    }, 1000)

    return () => {
      resetTimer();
    }
  }, [playCnt, changeIsGameOver, changeMusicRate, resetTimer])

  return (
    <Wrapper ref={timerDiv}>
      <TimerInner style={{ height: `${timerHeight}px` }} />
    </Wrapper>
  )
}

export default React.memo(Timer);
// export default Timer;