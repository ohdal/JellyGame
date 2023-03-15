import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'

import ScoreBox from '../components/ScoreBox'
import ReplayButton from '../components/ReplayButton'
import GameTable from '../components/GameTable'
import Timer from '../components/Timer'

import jelly1 from '../assets/images/jelly_type_1.png'
import jelly2 from '../assets/images/jelly_type_2.png'
import jelly3 from '../assets/images/jelly_type_3.png'
import jelly4 from '../assets/images/jelly_type_4.png'
import jelly5 from '../assets/images/jelly_type_5.png'
import jelly6 from '../assets/images/jelly_type_6.png'

const GameLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const GameLayoutInner = styled.div`
  width: 895px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Toolbar = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #66a7ba;
  padding-right: 56px;

  > * {
    margin-bottom: 10px;
  }
`;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6];

export default function GamePage() {
  const [list, setList] = useState([]);
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false);
  const [playCnt, setPlayCnt] = useState(0);

  const createList = useCallback(() => {
    const temp = []

    for (let i = 0; i < 10; i++) {
      temp.push([]);

      for (let j = 0; j < 15; j++) {
        temp[i].push({ visible: true, value: getRandomInt(1, 10), src: jellyList[getRandomInt(0, jellyList.length)] })
      }
    }

    setList(temp);
  }, [])

  const changeScore = (value) => {
    setScore(value);
  }

  const changeIsGameOver = (value) => {
    setIsGameOver(value);
  }

  const handleReplayButton = () => {
    setPlayCnt(v => v + 1);
  }

  useEffect(() => {
    changeIsGameOver(false);
    changeScore(0);
    createList();
  }, [playCnt])

  return (
    <GameLayout>
      <GameLayoutInner>
        <Toolbar>
          <ReplayButton handleReplayButton={handleReplayButton} />
          <ScoreBox score={score} />
        </Toolbar>
        <GameTable
          list={list}
          scroe={score}
          isGameOver={isGameOver}
          changeScore={changeScore}
          changeIsGameOver={changeIsGameOver}
        >
          <Timer playCnt={playCnt} changeIsGameOver={changeIsGameOver} />
        </GameTable>
      </GameLayoutInner>
    </GameLayout>
  )
}