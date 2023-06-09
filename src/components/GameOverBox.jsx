import React, { useEffect } from 'react'
import styled from 'styled-components'
import CustomAudio from '../utils/CustomAudio'

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

const audio_effect = new CustomAudio(effect_gameover, 0.5);
export default function GameOverBox() {

  useEffect(() => {
    audio_effect.playAudio();
  }, [])

  return (
    <tr>
      <td>
        <GameOverImg src={game_over_bg}>
          <img alt="" src={game_over} />
        </GameOverImg>
      </td>
    </tr>
  )
}
