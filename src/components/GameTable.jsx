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
          onMouseUp={(e) => {
            mouseEvent(e)
            checkBear("bear-" + idxr + "-" + idxc, "Up")
          }}
        >
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
    thTimer = setTimeout(() => {
      thTimer = null;
      const temp = fn();

      if (temp.w !== w && temp.h !== h) {
        fn();
      }
    }, delay)
  }
}

let startClientX
let startClientY
let tbodyRect

let thTimer;
let count = 0;
let sizeCount = 0;
export default function GameTable(props) {
  const { list, score, children, isGameOver, changeList, changeScore } = props;
  const [isDrag, setIsDrag] = useState(false);
  const [startBear, setStartBear] = useState(null);
  const dragComponentRef = useRef();

  const checkBear = useCallback((id, state) => {
    if (!startBear && state === "Down") {
      const array = id.split('-');
      setStartBear(array);
      dragComponentRef.current.setAreaPos({ x: Number(array[1]), y: Number(array[2]) });
    } else {
      console.log('score count start')
      const offsetX = Math.floor(dragComponentRef.current.getAreaSize().height / 56);
      const offsetY = Math.floor(dragComponentRef.current.getAreaSize().width / 52);
      const cn = dragComponentRef.current.getDirection();
      const { x, y } = dragComponentRef.current.getAreaPos();

      // debugger;

      // start, end
      let si, ei, sj, ej;
      switch (cn) {
        case "rightBottom":
          si = x;
          ei = x + offsetX;
          sj = y;
          ej = y + offsetY;
          break;
        case "rightTop":
          si = x - offsetX + 1;
          ei = x + 1;
          sj = y;
          ej = y + offsetY;
          break;
        case "leftBottom":
          si = x;
          ei = x + offsetX;
          sj = y - offsetY + 1;
          ej = y + 1;
          break;
        case "leftTop":
          si = x - offsetX + 1;
          ei = x + 1;
          sj = y - offsetY + 1;
          ej = y + 1;
          break;
        default:
          break;
      }

      let count = 0;
      let tempArray = JSON.parse(JSON.stringify(list));
      for (let i = si; i < ei; i++) {
        for (let j = sj; j < ej; j++) {
          if (list[i][j].visible) {
            count += list[i][j].value;
            tempArray[i][j].visible = false;
          }
        }
      }

      if (count === 10) {
        changeScore(v => v + (ei - si) * (ej - sj));
        changeList(tempArray);
      }

      setStartBear(null);
    }
  }, [list, startBear, score, changeScore, changeList])

  // MouseDown, MouseMove 이벤트시 isDrag 변수 설정
  // 드래그 영역 사이즈, 방향 설정 함수
  const mouseEvent = useCallback((e) => {
    if (e.target.className.includes("detection")) {
      if (!isDrag && e._reactName === "onMouseDown") {
        console.log('isDrag === false Down!!')
        setIsDrag(true);

        const el = document.getElementById("tbody-area")
        tbodyRect = el.getClientRects()[0]

        startClientX = e.target.parentNode.getClientRects()[0].x
        startClientY = e.target.parentNode.getClientRects()[0].y
      }

      if (isDrag && e._reactName === "onMouseMove") {
        // console.log('isDrag === true Move!!')
        if (tbodyRect.x > e.clientX || tbodyRect.y > e.clientY) return

        count++
        // console.log('count', count);
        throttle(dragComponentRef.current.getAreaSize(), () => {
          sizeCount++;
          // console.log('sizeCount', sizeCount);
          // console.log(e.clientX);
          // console.log(startClientX);
          const width = e.clientX - startClientX
          const height = e.clientY - startClientY

          
          let computedW, computedH
          if (width >= 0 && height >= 0) {
            dragComponentRef.current.setDirection("rightBottom");
            computedW = computedNumber(false, { width })
            computedH = computedNumber(false, { height })
          } else if (width < 0 && height >= 0) {
            dragComponentRef.current.setDirection("leftBottom");
            computedW = computedNumber(true, { width })
            computedH = computedNumber(false, { height })
          } else if (width >= 0 && height < 0) {
            dragComponentRef.current.setDirection("rightTop");
            computedW = computedNumber(false, { width })
            computedH = computedNumber(true, { height })
          } else {
            dragComponentRef.current.setDirection("leftTop");
            computedW = computedNumber(true, { width })
            computedH = computedNumber(true, { height })
          }


          dragComponentRef.current.setAreaSize({ w: computedW, h: computedH });

          // console.log(dragComponentRef.currnet);
          return { w: computedW, h: computedH, }
        }, 50)
      }
    }

    if (e._reactName === "onMouseUp" && isDrag) {
      noDragState();
    }
  }, [isDrag])

  const noDragState = () => {
    setIsDrag(false);
    setStartBear(null);
  }

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
        <NoDragArea className="top" onMouseEnter={() => { noDragState() }} />
        <NoDragArea className="left" onMouseEnter={() => { noDragState() }} />
        <NoDragArea className="right" onMouseEnter={() => { noDragState() }} />
        <NoDragArea className="bottom" onMouseEnter={() => { noDragState() }} />
      </div>
      {children}
    </Wrapper>
  )
}
