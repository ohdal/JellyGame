import React, { useEffect, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import ScoreBox from '../components/ScoreBox'
import CustomButton from '../components/CustomButton'
import GameTable from '../components/GameTable'
import Timer from '../components/Timer'

import jelly1 from '../assets/images/jelly_type_1.png'
import jelly2 from '../assets/images/jelly_type_2.png'
import jelly3 from '../assets/images/jelly_type_3.png'
import jelly4 from '../assets/images/jelly_type_4.png'
import jelly5 from '../assets/images/jelly_type_5.png'
import jelly6 from '../assets/images/jelly_type_6.png'
import icon_home from '../assets/images/home.png'
import icon_replay from '../assets/images/replay.png'

import effect_btn from '../assets/media/effect_buttonclick.mp3'

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
  padding-right: 56px;

  .left {
    float: left;
    text-align: left;
  }

  * {
    font-size: 20px;
    font-weight: bold;
    color: #66a7ba;
  } 

  > * {
    margin-bottom: 10px;
  }
`;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6];

const effectAudio = new Audio(effect_btn);
export default function GamePage() {
  const [list, setList] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playCnt, setPlayCnt] = useState(0);
  let history = useHistory();

  const createList = useCallback(() => {
    const temp = []

    for (let i = 0; i < 10; i++) {
      temp.push([]);

      for (let j = 0; j < 15; j++) {
        temp[i].push({
          visible: true,
          value: getRandomInt(1, 10),
          src: jellyList[getRandomInt(0, jellyList.length)],
        })
      }
    }

    setList(temp);
  }, [])

  const changeList = useCallback((value) => {
    setList(value);
  }, [])

  const changeScore = useCallback((value) => {
    setScore(value);
  }, [])

  const changeIsGameOver = useCallback((value) => {
    setIsGameOver(value);
  }, [])

  const handleHomeButton = useCallback(() => {
    history.push('/');
  }, [])

  const handleReplayButton = useCallback(() => {
    setPlayCnt(v => v + 1);
  }, [])

  useEffect(() => {
    changeIsGameOver(false);
    changeScore(0);
    createList();
  }, [playCnt, createList, changeScore, changeIsGameOver])

  return (
    <GameLayout>
      <GameLayoutInner>
        <Toolbar>
          <div className="left">
            <CustomButton clickFunc={() => {
              handleHomeButton();
              effectAudio.play();
            }}>
              Home<img alt="home" src={icon_home} />
            </CustomButton>
            <CustomButton clickFunc={() => {
              handleReplayButton();
              effectAudio.play();
            }}>
              Replay<img alt="replay" src={icon_replay} />
            </CustomButton>
          </div>
          <ScoreBox score={score} />
        </Toolbar>
        <GameTable
          list={list}
          score={score}
          isGameOver={isGameOver}
          changeList={changeList}
          changeScore={changeScore}
        >
          <Timer playCnt={playCnt} changeIsGameOver={changeIsGameOver} />
        </GameTable>
      </GameLayoutInner>
    </GameLayout>
  )
}
