import React, { useEffect, useState, useCallback, useRef, } from 'react'
import styled from 'styled-components';

import DragComponent from './DragComponent';
import game_over from '../assets/images/gameover.png'
import particle from '../assets/images/particle.gif'

import effect_mouse from '../assets/media/effect_mouseup.mp3'

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
  background: #171a1e;
  border: 3px solid #66a7ba;
  border-radius: 10px;
  padding: 10px;

  td {
    position: relative;
  }
`;

const ParticleImg = styled.img`
  width: 52px;
  height: 56px;
  position: absolute;
  top: 0;
  left: 0;
`

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
  z-index: 1;
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

const effectAudio = new Audio(effect_mouse);
const BearList = (props) => {
  const { list, mouseEvent, checkBear, particleGenerate } = props;

  return list.map((row, idxr) => {
    // idxr : idx + row
    // idxc : idx + col
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc} id={"bear-" + idxr + "-" + idxc}
          onMouseDown={(e) => {
            if (!col.visible) return;
            mouseEvent(e, true)
            checkBear(idxr, idxc, "Down");
          }}
          onMouseUp={(e) => {
            mouseEvent(e);
            checkBear(null, null, "Up");
          }}
        >
          {!col.visible && particleGenerate(idxr, idxc)}
          <JellyImg
            style={{ 'visibility': col.visible ? 'visible' : 'hidden' }}
            alt="jelly" className="no-drag detection" key={"jelly-" + idxc} src={col.src} />
          <JellyNumber
            style={{ 'visibility': col.visible ? 'visible' : 'hidden' }}
            className="detection">{col.value}</JellyNumber>
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

  const particleGenerate = useCallback((r, c) => {
    setTimeout(() => {
      const el = document.getElementById('particle-' + r + '-' + c);
      if (el) el.style.visibility = 'hidden';
    }, 500)

    return <ParticleImg alt="particle" id={'particle-' + r + '-' + c} src={particle} />
  }, []);


  const noDragState = useCallback(() => {
    if (isDrag) {
      setIsDrag(false);
      setStartBear(null);
    }
  }, [isDrag])

  // Mouse 이벤트 발생 시 처리 - 게임 점수 관련
  // Down: 클릭 시작점 td태그 id를 통해 x,y 위치 가져오기 (2차원배열 인덱스 값)
  // Up: DragComponent.jsx의 width, height 값을 통해 for문 돌릴 2차원배열 시작좌표, 끝좌표를 잡기 및 점수 계산하기
  const checkBear = useCallback((row, col, state) => {
    if (!startBear && state === "Down") {
      setStartBear(true);
      dragComponentRef.current.setAreaPos({ x: row, y: col });
    } else if (startBear) {
      console.log('score count start')
      const offsetX = Math.floor(dragComponentRef.current.getAreaSize().height / 56);
      const offsetY = Math.floor(dragComponentRef.current.getAreaSize().width / 52);
      const cn = dragComponentRef.current.getDirection();
      const { x, y } = dragComponentRef.current.getAreaPos();

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
        effectAudio.play();
      }

      setStartBear(null);
    }
  }, [list, startBear, changeScore, changeList])

  // Mouse 관련 이벤트 발생 시 처리 - 드래그 관련
  // Down: isDrag 변수 설정 (true), 마우스 클릭시의 최초 위치 값 저장
  // Move: 클릭시 저장된 최초 위치 값과 계속 바뀌는 사용자 위치 값 파악 후, 드래그 영역 방향 설정
  // Up: isDrag 변수 설정 (false)
  const mouseEvent = useCallback((e, isTdTag = false) => {

    // isTdTag 확인 이유 ?
    // <td />에 className으로 detection을 주게 되면 <tbody /> MouseMove이벤트 발생시에
    // 마우스가 Bear이미지 이외의 빈공간에 위치해도 Move 이벤트가 쓸데없이 발생하기 떄문에
    // detection className을 주지 않는다.

    // 하지만 <td />에 달린 MouseDown 이벤트 발생시 위에서 설명한 빈공간을 클릭한 경우
    // e.target으로 detection className이 추가되지 않은 <td />가 들어오면서
    // 아래 조건문에 걸리게 되고 isDrag는 false 상태이면서 checkBear 함수가 실행되서 오류가 나게 된다.
    // 따라서 detection className 조건 또는 <td /> 인지 확인하는 조건을 추가해주어 처리해준다.

    if (e.target.className.includes("detection") || isTdTag) {
      if (!isDrag && e._reactName === "onMouseDown") {
        setIsDrag(true);

        const el = document.getElementById("tbody-area")
        tbodyRect = el.getClientRects()[0]

        // v === true : e.target이 td 태그인 경우
        startClientX = isTdTag ? e.target.getClientRects()[0].x : e.target.parentNode.getClientRects()[0].x
        startClientY = isTdTag ? e.target.getClientRects()[0].y : e.target.parentNode.getClientRects()[0].y
      }

      if (isDrag && e._reactName === "onMouseMove") {
        if (tbodyRect.x > e.clientX || tbodyRect.y > e.clientY) return;

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
  }, [isDrag, noDragState])

  useEffect(() => {
    if (isGameOver) noDragState();

  }, [isGameOver, noDragState])

  useEffect(() => {
    effectAudio.volume = 0.5;
  }, [])

  return (
    <Wrapper>
      <div className="no-drag">
        <DragComponent className="rightBottom" isDrag={isDrag} ref={dragComponentRef}
          mouseEvent={mouseEvent} checkBear={checkBear} />
        <Table>
          <tbody id="tbody-area" onMouseMove={mouseEvent} onMouseUp={mouseEvent}>
            {isGameOver ?
              <tr>
                <td className="gameover-layout">
                  <div className="gameover-img">
                    <img alt="" src={game_over} />
                  </div>
                  <div className="gameover-text">
                    <p>{score}</p>
                  </div>
                </td>
              </tr>
              : <BearList list={list} mouseEvent={mouseEvent} checkBear={checkBear} particleGenerate={particleGenerate} />}
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
