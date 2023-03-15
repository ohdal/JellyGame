import React from 'react'
import styled from 'styled-components'
import replay from '../assets/images/replay.png'

const Wrapper = styled.div`
  float: left;
  text-align: left;

  > a {
    width: 100px;
    cursor: pointer;
    height: 35px;

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

export default function ReplayButton(props) {
  const { handleReplayButton } = props

  return (
    <Wrapper>
      <a onClick={handleReplayButton}>
        Replay<img alt="replay" src={replay} />
      </a>
    </Wrapper>
  )
}
