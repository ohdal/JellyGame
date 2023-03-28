import React, { useState, useEffect, useRef } from 'react'
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
  width: inherit;
  position: absolute;
  background: #66a7ba;
  bottom: 0;
`;

const TIME_VALUE = 5;
let time = TIME_VALUE;
let intervalId = null;
const Timer = (props) => {
  const { playCnt, changeIsGameOver } = props;
  const [timerHeight, setTimerHeight] = useState(null);

  const timerDiv = useRef();

  useEffect(() => {
    console.log('in');
    time = TIME_VALUE;

    if (intervalId) {
      clearInterval(intervalId);
    } else {
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
        }
      }, 1000)
    }
  }, [playCnt, changeIsGameOver])

  return (
    <Wrapper ref={timerDiv}>
      <TimerInner style={{ height: `${timerHeight}px` }} />
    </Wrapper>
  )
}

export default React.memo(Timer);