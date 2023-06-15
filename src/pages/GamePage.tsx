import React, { useEffect, useCallback, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CustomAudio from "../utils/CustomAudio";

import { ModalContext } from "../containers/ModalContainer";

import ScoreBox from "../components/ScoreBox";
import VolumeSlider from "../components/VolumeSlider";
import GameTable from "../components/GameTable";
import Timer from "../components/Timer";

import jelly1 from "../assets/images/jelly_type_1.png";
import jelly2 from "../assets/images/jelly_type_2.png";
import jelly3 from "../assets/images/jelly_type_3.png";
import jelly4 from "../assets/images/jelly_type_4.png";
import jelly5 from "../assets/images/jelly_type_5.png";
import jelly6 from "../assets/images/jelly_type_6.png";
import icon_home from "../assets/images/home.png";
import icon_replay from "../assets/images/replay.png";

import effect_btn from "../assets/media/effect_buttonclick.mp3";
import effect_mouse from "../assets/media/effect_mouseup.mp3";
import music_background from "../assets/media/music_background.mp3";

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

    > :not(:last-child) {
      margin-right: 5px;
    }
  }

  .left,
  .right {
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

const ImgButton = styled.button`
  position: relative;
  width: 100px;
  height: 35px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  text-align: left;

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    transform: translate(0, -3px);
  }

  &:hover {
    font-size: 22px;
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
`;

export interface BearList {
  visible: boolean;
  value: number;
  src: string;
}

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6];

const DEFAULT_VOLUME = 0.3;
const audio_effect_mouse = new CustomAudio(effect_mouse, DEFAULT_VOLUME * 1.5);
const audio_effect_btn = new CustomAudio(effect_btn, DEFAULT_VOLUME * 1.5);
const audio_music_background = new CustomAudio(music_background, DEFAULT_VOLUME, true);

// 기능 : min 이상 max 미만의 랜덤값을 반환
// 인자 : 최솟값 min, 최댓값 max
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// 기능 : 모든 Audio 객체 볼륨 조절
// 인자 : 볼륨 값 volume (기본 1.0)
const changeVolume = (volume: number): void => {
  // effectVolume이 배경음악보다 작기 때문에 1.5배
  const effectVolume = volume * 1.5;
  audio_effect_btn.changeVolume(effectVolume > 1 ? 1 : effectVolume);
  audio_effect_mouse.changeVolume(effectVolume > 1 ? 1 : effectVolume);
  audio_music_background.changeVolume(volume);
};

export default function GamePage() {
  const [list, setList] = useState<BearList[][]>([]); // 2차원 배열 Array
  const [score, setScore] = useState(0); // 점수 number
  const [isGameOver, setIsGameOver] = useState(false); // 게임오버 여부 boolean
  const [playCnt, setPlayCnt] = useState(0); // 게임 재시작 카운트 number
  const modalContext = useContext(ModalContext);
  let history = useHistory();

  // 기능 : 2차원 배열 Array 생성
  // 인자 : 없음
  const createList = useCallback(() => {
    // 선언형 👉🏻
    const temp: BearList[][] = Array.from(Array(10), () =>
      Array(15)
        .fill(null)
        .map(() => {
          return {
            visible: true,
            value: getRandomInt(1, 10),
            src: jellyList[getRandomInt(0, jellyList.length)],
          };
        })
    );

    /* 명령형 👉🏻
    for (let i = 0; i < 10; i++) {
      temp.push([]);

      for (let j = 0; j < 15; j++) {
        temp[i].push({
          visible: true,
          value: getRandomInt(1, 10),
          src: jellyList[getRandomInt(0, jellyList.length)],
        })
      }
    } */

    setList(temp);
  }, []);

  // 기능 : '/' url로 이동
  // 인자 : 없음
  const handleHomeButton = useCallback(() => {
    history.push("/");
  }, [history]);

  // 기능 : playCnt state 값 증가
  // 인자 : 없음
  const handleReplayButton = useCallback(() => {
    setPlayCnt((v) => v + 1);
  }, []);

  // 역할 : playCnt state 변경시 replay 처리
  useEffect(() => {
    audio_music_background.playAudio();
    setIsGameOver(false);
    setScore(0);
    createList();
  }, [playCnt, createList]);

  // 역할 : GamePage.jsx mount시 audio 볼륨 default로 설정
  useEffect(() => {
    changeVolume(DEFAULT_VOLUME);

    return () => {
      audio_music_background.resetAudio();
    };
  }, []);

  return (
    <GameLayout>
      <HowToButton
        className="pointer"
        onClick={() => {
          if (modalContext?.modal.current) modalContext.modal.current.toggle();
        }}
      >
        ?
      </HowToButton>
      <GameLayoutInner>
        <Toolbar>
          <div className="left">
            <ImgButton
              onClick={() => {
                handleHomeButton();
                audio_effect_btn.playAudio();
              }}
            >
              Home
              <img alt="home" src={icon_home} />
            </ImgButton>
            <ImgButton
              onClick={() => {
                handleReplayButton();
                audio_effect_btn.playAudio();
                audio_music_background.resetAudio();
              }}
            >
              Replay
              <img alt="replay" src={icon_replay} />
            </ImgButton>
          </div>
          <div className="right">
            <VolumeSlider changeVolume={changeVolume} defaultVolume={DEFAULT_VOLUME} />
            <ScoreBox score={score} />
          </div>
        </Toolbar>
        <GameTable
          list={list}
          isGameOver={isGameOver}
          changeList={setList}
          changeScore={setScore}
          audio={audio_effect_mouse}
        >
          <Timer
            playCnt={playCnt}
            changeIsGameOver={setIsGameOver}
            resetMusic={audio_music_background.resetAudio}
            changeMusicRate={audio_music_background.changeRate}
          />
        </GameTable>
      </GameLayoutInner>
    </GameLayout>
  );
}
