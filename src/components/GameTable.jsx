import React, { useEffect, } from 'react'
import styled from 'styled-components';

import game_over from '../assets/images/gameover.png'

const Wrapper = styled.div`
  min-height: 600px;

  > * {
    display: inline-block;
  }

  > div {
    position: relative;
  }

  .no-drag {
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
  }
`;

const Table = styled.table`
  width: 838px;
  height: 608px;
  background: #282c34;
  border: 3px solid #66a7ba;
  border-radius: 10px;
  padding: 10px;

  td {
    position: relative;
  }
`;

const JellyImg = styled.img`
  width: 50px;
  height: 50px;
`;

const JellyNumber = styled.p`
  background: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  font-weight: bold;
  color: #616161;
`;

const listPCS = (list, MouseEvent, checkBear) => {
  return list.map((row, idxr) => {
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc} id={"bear-" + idxr + "-" + idxc}
          style={{ 'visibility': col.visible ? 'visible' : 'hidden' }}
          onMouseDown={(e) => {
            MouseEvent(e)
            checkBear("bear-" + idxr + "-" + idxc, "Down")
          }}
          onMouseUp={() => { checkBear("bear-" + idxr + "-" + idxc, "Up") }}>
          <JellyImg alt="jelly" className="no-drag detection" key={"jelly-" + idxc} src={col.src} />
          <JellyNumber className="detection">{col.value}</JellyNumber>
        </td>
      })
    }</tr>;
  })
}

export default function GameTable(props) {
  const { list, score, children, isGameOver, changeScore, changeIsGameOver } = props;

  const checkBear = () => {

  }

  const MouseEvent = () => {

  }

  return (
    <Wrapper>
      <div className="no-drag">
        <Table>
          <tbody id="tbody-area" onMouseMove={MouseEvent} onMouseUp={MouseEvent}>
            {isGameOver ?
              <tr>
                <td className="gameover-layout">
                  <div className="gameover-img"><img alt="" src={game_over} /></div>
                  <div className="gameover-text"><p>{score}</p></div>
                </td>
              </tr>
              : listPCS(list, MouseEvent, checkBear)}
          </tbody>
        </Table>
      </div>
      {children}
    </Wrapper>
  )
}
