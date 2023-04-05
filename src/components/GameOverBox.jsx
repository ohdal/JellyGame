import React, {useEffect} from 'react'
import styled from 'styled-components'

import game_over_bg from '../assets/images/gameover_BG.png'
import game_over from '../assets/images/gameover.png'

import effect_gameover from '../assets/media/effect_gameover.mp3'

const GameOverImg = styled.div`
  width: 100%;
  background: url(${props => props.src}), no-repeat;

  img {
    width: inherite !important;
    animation: gameover infinite .6s linear;
  }

  @keyframes gameover {
    0% {
      transform: translate(0, 0);
    }

    20% {
      transform: translate(-10px, 0);
    }

    40% {
      transform: translate(10px, 0);
    }

    60% {
      transform: translate(-10px, 0);
    }

    80% {
      transform: translate(10px, 0);
    }

    100% {
      transform: translate(0, 0);
    }
  }
`
const GameOverText = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #66a7ba;
`

const effectAudio = new Audio(effect_gameover);
export default function GameOverBox({ children }) {

  useEffect(() => {
    effectAudio.volume = 0.5;
    effectAudio.play();
  }, [])

  return (
    <tr>
      <td>
        <GameOverImg src={game_over_bg}>
          <img alt="" src={game_over} />
        </GameOverImg>
        {/* <GameOverText>
          {children}
        </GameOverText> */}
      </td>
    </tr>
  )
}
