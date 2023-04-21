import React, { useEffect, useState, useCallback, useRef, } from 'react'
import styled from 'styled-components';

import GameOverBox from './GameOverBox';
import DragComponent from './DragComponent';
import particle from '../assets/images/particle.gif'

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


// Particle Img 컴포넌트
const Particle = (props) => {
  const { r, c } = props

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('particle-' + r + '-' + c);
      if (el) el.style.visibility = 'hidden';
    }, 500)
  }, [r, c])

  return <ParticleImg alt="particle" id={'particle-' + r + '-' + c} src={particle} />
};

// Table 내 tr, td 태그 컴포넌트
const BearList = (props) => {
  const { list, mouseEvent, checkBear, } = props;

  return list.map((row, idxr) => {
    // idxr : idx + row
    // idxc : idx + col
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc}
          onMouseDown={(e) => {
            if (!col.visible) return;
            mouseEvent(e, true)
            checkBear(idxr, idxc, "Down");
          }}
        >
          {!col.visible && <Particle r={idxr} c={idxc} />}
          <JellyImg
            style={{ 'opacity': col.visible ? 1 : 0 }}
            alt="jelly" className={`no-drag detection ${col.visible && 'pointer'}`}
            key={"jelly-" + idxc} src={col.src} />
          <JellyNumber
            style={{ 'opacity': col.visible ? 1 : 0 }}
            className={`detection ${col.visible && 'pointer'}`}>
            {col.value}
          </JellyNumber>
        </td>
      })
    }</tr>;
  })
}

// 기능 : 드래그 영역 사이즈 계산
// 인자 : 음수 값 여부 bool, 너비 또는 높이 값 object
const computedDragAreaSize = (isMinus, { width, height }) => {
  // border-spacing: 2px;
  const standard = width ? 54 : 58
  const value = width ? width : height

  if (isMinus) return standard * (Math.ceil(value * -1 / standard) + 1)
  else return standard * Math.ceil(value / standard)
}

// 기능 : 마우스 이벤트 오버클락 방지
// 인자 : 드래그 영역 사이즈 object, 실행 함수 function, 지연 시간 number
const throttle = (data, fn, delay) => {
  let w = data.width
  let h = data.height
  if (!thTimer) {
    thTimer = setTimeout(() => {
      thTimer = null;
      const temp = fn();

      // 드래그 영역 사이즈가 마지막에 계산된 사이즈와 맞는지 체크  
      if (temp.w !== w && temp.h !== h) {
        fn();
      }
    }, delay)
  }
}

let startClientX
let startClientY

let thTimer;
let count = 0;
let sizeCount = 0;
const GameTable = (props) => {
  const { list, children, isGameOver, changeList, changeScore, audio } = props;
  const [isDrag, setIsDrag] = useState(false);
  const [startBear, setStartBear] = useState(null);
  const dragComponentRef = useRef();

  // 기능 : 사용자가 드래그 하지 않는 상태 일 때 처리
  // 인자 : 없음
  const noDragState = useCallback(() => {
    if (isDrag) {
      setIsDrag(false);
      setStartBear(null);
      startClientX = null;
      startClientY = null;
    }
  }, [isDrag])

  // 기능 : Mouse 이벤트 발생 시 게임 점수 관련 처리
  // 인자 : row 값 number, col 값 number, 마우스 down, up 상태 값 string
  const checkBear = useCallback((row, col, state) => {
    if (!startBear && state === "Down") {
      // row,col값(2차원배열 인덱스 값)을 받아 DragComponent.jsx xPos, yPos값 변경하기
      setStartBear(true);
      dragComponentRef.current.setAreaPos({ x: row, y: col });
    } else if (startBear) {
      // DragComponent.jsx의 width, height 값을 통해 for문 돌릴 시작조건, 종료조건 잡기 및 점수 계산하기
      // border-spacing: 2px;
      const offsetX = Math.floor(dragComponentRef.current.getAreaSize().height / 58);
      const offsetY = Math.floor(dragComponentRef.current.getAreaSize().width / 54);
      const cn = dragComponentRef.current.getDirection();
      const { x, y } = dragComponentRef.current.getAreaPos();

      // start, end
      // 드래그 방향에 따라 이중for문 시작조건, 종료조건이 달라짐
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
        audio.play();
      }

      setStartBear(null);
    }
  }, [list, startBear, changeScore, changeList, audio])

  // 기능 : Mouse 관련 이벤트 발생 시 드래그 관련 처리
  // 인자 : 마우스 이벤트 객체 object, 이벤트 발생 객체 <td/> 여부 값 bool
  const mouseEvent = useCallback((e, isTdTag = false) => {

    /* 
    isTdTag 확인 이유 ?
    <td />에 className으로 detection을 주게 되면 <tbody /> MouseMove이벤트 발생시에
    마우스가 Bear이미지 이외의 빈공간에 위치해도 Move 이벤트가 쓸데없이 발생하기 떄문에
    detection className을 주지 않는다. 
    
    하지만 <td />에 달린 MouseDown 이벤트 발생시 위에서 설명한 빈공간을 클릭한 경우
    e.target으로 detection className이 추가되지 않은 <td />가 들어오면서
    아래 조건문에 걸리게 되고 isDrag는 false 상태이면서 checkBear 함수가 실행되서 오류가 나게 된다.
    따라서 detection className 조건 또는 <td /> 인지 확인하는 조건을 추가해주어 처리해준다.
    */

    if (e.target.className.includes("detection") || isTdTag) {
      if (!isDrag && e._reactName === "onMouseDown") {
        // isDrag 변수 설정 (true), 마우스 클릭시의 최초 위치 값 저장
        setIsDrag(true);

        // v === true : e.target이 td 태그인 경우
        startClientX = isTdTag ? e.target.getClientRects()[0].x : e.target.parentNode.getClientRects()[0].x
        startClientY = isTdTag ? e.target.getClientRects()[0].y : e.target.parentNode.getClientRects()[0].y
      }

      if (isDrag && e._reactName === "onMouseMove") {
        // 클릭시 저장된 최초 위치 값과 계속 바뀌는 사용자 위치 값 파악 후, 드래그 영역 방향, 사이즈 설정
        count++
        console.log('throttle 적용 전', count);
        throttle(dragComponentRef.current.getAreaSize(), () => {
          sizeCount++;
          console.log('throttle 적용 후', sizeCount);

          const width = e.clientX - startClientX
          const height = e.clientY - startClientY

          let computedW, computedH
          if (width >= 0 && height >= 0) {
            dragComponentRef.current.setDirection("rightBottom");
            computedW = computedDragAreaSize(false, { width })
            computedH = computedDragAreaSize(false, { height })
          } else if (width < 0 && height >= 0) {
            dragComponentRef.current.setDirection("leftBottom");
            computedW = computedDragAreaSize(true, { width })
            computedH = computedDragAreaSize(false, { height })
          } else if (width >= 0 && height < 0) {
            dragComponentRef.current.setDirection("rightTop");
            computedW = computedDragAreaSize(false, { width })
            computedH = computedDragAreaSize(true, { height })
          } else {
            dragComponentRef.current.setDirection("leftTop");
            computedW = computedDragAreaSize(true, { width })
            computedH = computedDragAreaSize(true, { height })
          }


          dragComponentRef.current.setAreaSize({ w: computedW, h: computedH });

          // console.log(dragComponentRef.currnet);
          return { w: computedW, h: computedH, }
        }, 100)
      }
    }


    if (e._reactName === "onMouseUp") {
      // isDrag 변수 설정 (false)
      noDragState();
    }
    if (e._reactName === "onMouseLeave" && e.target.tagName === "TABLE") {
      // isDrag 변수 설정 (false)
      noDragState();
    }

  }, [isDrag, noDragState])

  useEffect(() => {
    if (isGameOver) noDragState();

  }, [isGameOver, noDragState])

  return (
    <Wrapper>
      <div className="no-drag">
        <DragComponent className="rightBottom" isDrag={isDrag} ref={dragComponentRef}
          mouseEvent={mouseEvent} checkBear={checkBear} />
        <Table onMouseLeave={mouseEvent}>
          <tbody id="tbody-area" onMouseMove={mouseEvent} onMouseUp={mouseEvent}>
            {isGameOver ?
              <GameOverBox />
              :
              <BearList list={list} mouseEvent={mouseEvent} checkBear={checkBear} />}
          </tbody>
        </Table>
      </div>
      {children}
    </Wrapper>
  )
}

export default React.memo(GameTable);
// export default GameTable;