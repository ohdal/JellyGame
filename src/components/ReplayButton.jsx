import React from 'react'
import styled from 'styled-components'
import replay from '../assets/images/replay.png'

import effect_btn from '../assets/media/effect_buttonclick.mp3'

const Wrapper = styled.div`
  float: left;
  text-align: left;

  > button {
    width: 100px;
    height: 35px;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
      position: absolute;
    }

    &:hover {
      font-size: 22px;
    }
  }
`;

const effectAudio = new Audio(effect_btn);
export default function ReplayButton(props) {
  const { handleReplayButton } = props

  return (
    <Wrapper>
      <button
        onClick={() => {
          handleReplayButton();
          effectAudio.play();
        }}>
        Replay<img alt="replay" src={replay} />
      </button>
    </Wrapper>
  )
}
