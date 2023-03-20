import React, { useEffect, useState, useCallback, useRef, } from 'react'
import styled from 'styled-components';

import DragComponent from './DragComponent';
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

const NoDragArea = styled.div`
  position: absolute;
  z-index: -1;

  &.top {
    width: calc(100% + 110px);
    height: 100px;
    top: -100px;
    left: -55px;
  }

  &.left {
    width: 100px;
    height: 100%;
    top: 0;
    left: -100px;
  }

  &.right {
    width: 100px;
    height: 100%;
    top: 0;
    right: -100px;
  }

  &.bottom {
    width: calc(100% + 110px);
    height: 100px;
    bottom: -100px;
    left: -55px;
  }
`;

const BearList = (props) => {
  const { list, mouseEvent, checkBear } = props;

  return list.map((row, idxr) => {
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc} id={"bear-" + idxr + "-" + idxc}
          style={{ 'visibility': col.visible ? 'visible' : 'hidden' }}
          onMouseDown={(e) => {
            mouseEvent(e)
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

const computedNumber = (isMinus, WH) => {
  const standard = WH.width ? 54 : 58
  const value = WH.width ? WH.width : WH.height

  if (isMinus) return standard * (Math.ceil(value * -1 / standard) + 1)
  else return standard * Math.ceil(value / standard)
}

const throttle = (data, fn, delay) => {
  let w = data.width
  let h = data.height
  if (!thTimer) {
    //    count++
    //    console.log(count)
    thTimer = setTimeout(() => {
      thTimer = null;
      const temp = fn()

      if (temp.w !== w && temp.h !== h) {
        //        console.log('in')
        fn()
      }
    }, delay)
  }
}

let startClientX
let startClientY
let tbodyRect

let thTimer;
let count = 0;
export default function GameTable(props) {
  const { list, score, children, isGameOver, changeScore, changeIsGameOver } = props;
  const [isDrag, setIsDrag] = useState(false);
  const dragComponentRef = useRef();

  const checkBear = () => {

  }

  const mouseEvent = useCallback((e) => {
    if (e.target.className.includes("detection")) {
      if (!isDrag && e._reactName === "onMouseDown") {
        setIsDrag(true);

        const el = document.getElementById("tbody-area")
        tbodyRect = el.getClientRects()[0]

        startClientX = e.target.parentNode.getClientRects()[0].x
        startClientY = e.target.parentNode.getClientRects()[0].y
      }

      if (isDrag && e._reactName === "onMouseMove") {
        if (tbodyRect.x > e.clientX || tbodyRect.y > e.clientY) return

        count++
        console.log(count);
        throttle(dragComponentRef.current.getAreaSize(), () => {
          // console.log(e.clientX);
          // console.log(startClientX);
          const width = e.clientX - startClientX
          const height = e.clientY - startClientY

          let computedW, computedH
          if (width >= 0 && height >= 0) {
            dragComponentRef.current.setDirection("area rightBottom");
            computedW = computedNumber(false, { width })
            computedH = computedNumber(false, { height })
          } else if (width < 0 && height >= 0) {
            dragComponentRef.current.setDirection("area leftBottom");
            computedW = computedNumber(true, { width })
            computedH = computedNumber(false, { height })
          } else if (width >= 0 && height < 0) {
            dragComponentRef.current.setDirection("area rightTop");
            computedW = computedNumber(false, { width })
            computedH = computedNumber(true, { height })
          } else {
            dragComponentRef.current.setDirection("area leftTop");
            computedW = computedNumber(true, { width })
            computedH = computedNumber(true, { height })
          }


          dragComponentRef.current.setAreaSize({ w: computedW, h: computedH });

          // console.log(dragComponentRef.currnet);
          return { dir: dragComponentRef.current.getDirection, w: computedW, h: computedH, }
        }, 50)
      }
    }

    // console.log(e.target.className);
    if (e._reactName === "onMouseUp" && isDrag) {
      setIsDrag(false);
    }
  }, [isDrag])

  return (
    <Wrapper>
      <div className="no-drag">
        <DragComponent className="rightBottom" isDrag={isDrag} ref={dragComponentRef} />
        <Table>
          <tbody id="tbody-area" onMouseMove={mouseEvent} onMouseUp={mouseEvent}>
            {isGameOver ?
              <tr>
                <td className="gameover-layout">
                  <div className="gameover-img"><img alt="" src={game_over} /></div>
                  <div className="gameover-text"><p>{score}</p></div>
                </td>
              </tr>
              : <BearList list={list} mouseEvent={mouseEvent} checkBear={checkBear} />}
          </tbody>
        </Table>
        <NoDragArea className="top" onMouseEnter={() => { setIsDrag(false) }} />
        <NoDragArea className="left" onMouseEnter={() => { setIsDrag(false) }} />
        <NoDragArea className="right" onMouseEnter={() => { setIsDrag(false) }} />
        <NoDragArea className="bottom" onMouseEnter={() => { setIsDrag(false) }} />
      </div>
      {children}
    </Wrapper>
  )
}
