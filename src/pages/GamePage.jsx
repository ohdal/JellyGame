import React, { useEffect, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { ModalContext } from '../containers/ModalContainer'

import ScoreBox from '../components/ScoreBox'
import VolumeSlider from '../components/VolumeSlider'
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
import music_background from '../assets/media/music_background.mp3'

const GameLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;
`;

const GameLayoutInner = styled.div`
  width: 895px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Toolbar = styled.div`
  height: 35px;
  line-height: 35px;
  padding-right: 56px;

  .left {
    float: left;
    text-align: left;
  }

  .right {
    float: right;
    text-align: right;

    >:not(:last-child) {
      margin-right: 5px;
    }
  }

  .left, .right {
    > div {
      display: inline-block;
    }
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

const HowToButton = styled.p`
  position: absolute;
  width: 25px;
  height: 25px;
  margin: 0 !important;
  border: 3px solid #66a7ba;
  border-radius: 50%;
  color: #66a7ba;
  font-size: 15px;
  font-weight: bold;
  text-align: center; 
`

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6];

const DEFAULT_VOLUME = 0.3;
const effectAudio = new Audio(effect_btn);
const musicAudio = new Audio(music_background);

musicAudio.loop = true;
musicAudio.volume = DEFAULT_VOLUME;
effectAudio.volume = DEFAULT_VOLUME * 1.5;

const resetMusic = () => {
  musicAudio.pause();
  musicAudio.playbackRate = 1.0;
  musicAudio.currentTime = 0;
}

const changeMusicRate = (v) => {
  musicAudio.playbackRate = v;
}

const changeVolume = (v) => {
  const effectVolume = v * 1.5;
  effectAudio.volume = effectVolume > 1 ? 1 : effectVolume;
  musicAudio.volume = v;
}

export default function GamePage() {
  const [list, setList] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playCnt, setPlayCnt] = useState(0);
  const modalContext = useContext(ModalContext);
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
  }, [history])

  const handleReplayButton = useCallback(() => {
    setPlayCnt(v => v + 1);
  }, [])

  useEffect(() => {
    musicAudio.play();
    changeIsGameOver(false);
    changeScore(0);
    createList();
  }, [playCnt, createList, changeScore, changeIsGameOver])

  useEffect(() => {
    return () => {
      changeVolume(DEFAULT_VOLUME);
    }
  }, [])

  return (
    <GameLayout>
      <HowToButton className="pointer"
        onClick={() => { modalContext.modal.current.toggle() }}>
        ?
      </HowToButton>
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
          <div className="right">
            <VolumeSlider changeVolume={changeVolume} defaultVolume={DEFAULT_VOLUME} />
            <ScoreBox score={score} />
          </div>
        </Toolbar>
        <GameTable
          list={list}
          score={score}
          isGameOver={isGameOver}
          changeList={changeList}
          changeScore={changeScore}
        >
          <Timer playCnt={playCnt} changeIsGameOver={changeIsGameOver}
            resetMusic={resetMusic} changeMusicRate={changeMusicRate} />
        </GameTable>
      </GameLayoutInner>
    </GameLayout>
  )
}
