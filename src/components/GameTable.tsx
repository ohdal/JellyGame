import React, { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import styled from "styled-components";
import { BearList } from "pages/GamePage";

import GameOverBox from "./GameOverBox";
import DragComponent, { DragComponentHandle } from "./DragComponent";
import particle from "../assets/images/particle.gif";
import CustomAudio from "utils/CustomAudio";

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
  z-index: 1;
  text-align: center;
  font-weight: bold;
  color: #616161;
`;

interface ParticleComponentProps {
  row: number;
  col: number;
}

interface BearListComponentProps {
  list: BearList[][];
  mouseEvent: MouseEventFunction;
  scoreCheck: ScoreCheckFunction;
}

interface Props {
  list: BearList[][];
  children: ReactNode;
  isGameOver: Boolean;
  changeList: React.Dispatch<React.SetStateAction<BearList[][]>>;
  changeScore: React.Dispatch<React.SetStateAction<number>>;
  audio: CustomAudio;
}

export type MouseEventFunction = (
  e: React.MouseEvent<HTMLDivElement | HTMLTableElement> | ReactEvent,
  isTdTag?: boolean
) => void;
export type ScoreCheckFunction = (row: number | null, col: number | null, state: string) => void;
type ReactEvent = { _reactName: string; clientX: number; clientY: number };
type ComputedDragAreaSize = (isMinus: boolean, type: string, value: number) => number;
type Throttle = (data: { width: number; height: number }, fn: () => { w: number; h: number }, delay: number) => void;

// Particle Img 컴포넌트
const ParticleComponent = (props: ParticleComponentProps) => {
  const { row, col } = props;

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById("particle-" + row + "-" + col);
      if (el) el.style.visibility = "hidden";
    }, 500);
  }, [row, col]);

  return <ParticleImg alt="particle" id={"particle-" + row + "-" + col} src={particle} />;
};

// Table 내 tr, td 태그 컴포넌트
const BearListComponent = (props: BearListComponentProps) => {
  const { list, mouseEvent, scoreCheck } = props;

  return (
    <>
      {list.map((row, idxr) => {
        // idxr : idx + row
        // idxc : idx + col
        return (
          <tr key={"row-" + idxr}>
            {row.map((col, idxc) => {
              return (
                <td
                  key={"col-" + idxc}
                  onMouseDown={(e) => {
                    if (!col.visible) return;
                    mouseEvent(e, true);
                    scoreCheck(idxr, idxc, "Down");
                  }}
                >
                  {!col.visible && <ParticleComponent row={idxr} col={idxc} />}
                  <JellyImg
                    style={{ opacity: col.visible ? 1 : 0 }}
                    alt="jelly"
                    className={`no-drag detection ${col.visible && "pointer"}`}
                    key={"jelly-" + idxc}
                    src={col.src}
                  />
                  <JellyNumber
                    style={{ opacity: col.visible ? 1 : 0 }}
                    className={`detection ${col.visible && "pointer"}`}
                  >
                    {col.value}
                  </JellyNumber>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

// 기능 : 드래그 영역 사이즈 계산
// 인자 : 음수 값 여부 bool, 너비 또는 높이 string, 너비 또는 높이 값 number
const computedDragAreaSize: ComputedDragAreaSize = (isMinus, type, value) => {
  // border-spacing: 2px;
  const standard = type === "width" ? 54 : 58;

  if (isMinus) return standard * (Math.ceil((value * -1) / standard) + 1);
  else return standard * Math.ceil(value / standard);
};

// 기능 : 마우스 이벤트 오버클락 방지
// 인자 : 드래그 영역 사이즈 object, 실행 함수 function, 지연 시간 number
const throttle: Throttle = (data, fn, delay) => {
  let w = data.width;
  let h = data.height;
  if (!throttleTimer) {
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
      try {
        const temp = fn();

        // 드래그 영역 사이즈가 마지막에 계산된 사이즈와 맞는지 체크
        if (temp.w !== w && temp.h !== h) {
          fn();
        }
      } catch (error: any) {
        alert(error.message);
      }
    }, delay);
  }
};

let startClientX: number | null;
let startClientY: number | null;

let throttleTimer: NodeJS.Timeout | null;
let count = 0;
let sizeCount = 0;
const GameTable = (props: Props) => {
  const { list, children, isGameOver, changeList, changeScore, audio } = props;
  const [isDrag, setIsDrag] = useState(false);
  const [startBear, setStartBear] = useState<boolean | null>(null);
  const dragComponentRef = useRef<DragComponentHandle | null>(null);

  // 기능 : 사용자가 드래그 하지 않는 상태 일 때 처리
  // 인자 : 없음
  const noDragState = useCallback(() => {
    if (isDrag) {
      setIsDrag(false);
      setStartBear(null);
      startClientX = null;
      startClientY = null;
    }
  }, [isDrag]);

  // 기능 : Mouse 이벤트 발생 시 게임 점수 관련 처리
  // 인자 : row 값 number, col 값 number, 마우스 down, up 상태 값 string
  const scoreCheckFunction: ScoreCheckFunction = useCallback(
    (row, col, state) => {
      if (!dragComponentRef.current) return;

      if (!startBear && state === "Down") {
        // row,col값(2차원배열 인덱스 값)을 받아 DragComponent.jsx xPos, yPos값 변경하기
        setStartBear(true);
        dragComponentRef.current.setAreaPos({ x: row as number, y: col as number });
      } else if (startBear) {
        // DragComponent.jsx의 width, height 값을 통해 for문 돌릴 시작조건, 종료조건 잡기 및 점수 계산하기
        // border-spacing: 2px;
        const offsetX = Math.floor(dragComponentRef.current.getAreaSize().height / 58);
        const offsetY = Math.floor(dragComponentRef.current.getAreaSize().width / 54);
        const cn = dragComponentRef.current.getDirection();
        const { x, y } = dragComponentRef.current.getAreaPos();

        // start, end
        // 드래그 방향에 따라 이중for문 시작조건, 종료조건이 달라짐
        let si = 0,
          ei = 0,
          sj = 0,
          ej = 0;
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
          changeScore((v) => v + (ei - si) * (ej - sj));
          changeList(tempArray);
          audio.playAudio();
        }

        setStartBear(null);
      }
    },
    [list, startBear, changeScore, changeList, audio]
  );

  // 기능 : Mouse 관련 이벤트 발생 시 드래그 관련 처리
  // 인자 : 마우스 이벤트 객체 object, 이벤트 발생 객체 <td/> 여부 값 bool
  const mouseEventFunction: MouseEventFunction = useCallback(
    (e, isTdTag = false) => {
      /* 
    isTdTag 확인 이유 ?
    <td />에 className으로 detection을 주게 되면 <tbody /> MouseMove이벤트 발생시에
    마우스가 Bear이미지 이외의 빈공간에 위치해도 Move 이벤트가 쓸데없이 발생하기 떄문에
    detection className을 주지 않는다. 
    
    하지만 <td />에 달린 MouseDown 이벤트 발생시 위에서 설명한 빈공간을 클릭한 경우
    e.target으로 detection className이 추가되지 않은 <td />가 들어오면서
    아래 조건문에 걸리게 되고 isDrag는 false 상태이면서 scoreCheckFunction 함수가 실행되서 오류가 나게 된다.
    따라서 detection className 조건 또는 <td /> 인지 확인하는 조건을 추가해주어 처리해준다.
    */

      const target = (e as React.MouseEvent<HTMLDivElement | HTMLTableElement>).target as Element;
      const eventName = (e as ReactEvent)._reactName;

      switch (eventName) {
        case "onMouseDown":
          if (target.className.includes("detection") || isTdTag) {
            if (!isDrag) {
              // isDrag 변수 설정 (true), 마우스 클릭시의 최초 위치 값 저장
              setIsDrag(true);

              // v === true : e.target이 td 태그인 경우
              startClientX = isTdTag
                ? target.getClientRects()[0].x
                : (target.parentNode as Element).getClientRects()[0].x;
              startClientY = isTdTag
                ? target.getClientRects()[0].y
                : (target.parentNode as Element).getClientRects()[0].y;
            } else {
              // 클릭시 저장된 최초 위치 값과 계속 바뀌는 사용자 위치 값 파악 후, 드래그 영역 방향, 사이즈 설정
              count++;
              console.log("throttle 적용 전", count);

              if (dragComponentRef.current)
                throttle(
                  dragComponentRef.current.getAreaSize(),
                  () => {
                    if (!dragComponentRef.current) throw new ErrorEvent("dragComponentRef not founded.");

                    sizeCount++;
                    console.log("throttle 적용 후", sizeCount);

                    let width: number = 0,
                      height: number = 0;
                    if (startClientX && startClientY) {
                      width = e.clientX - startClientX;
                      height = e.clientY - startClientY;
                    }

                    let computedW = 0,
                      computedH = 0;
                    if (width >= 0 && height >= 0) {
                      dragComponentRef.current.setDirection("rightBottom");
                      computedW = computedDragAreaSize(false, "width", width);
                      computedH = computedDragAreaSize(false, "height", height);
                    } else if (width < 0 && height >= 0) {
                      dragComponentRef.current.setDirection("leftBottom");
                      computedW = computedDragAreaSize(true, "width", width);
                      computedH = computedDragAreaSize(false, "height", height);
                    } else if (width >= 0 && height < 0) {
                      dragComponentRef.current.setDirection("rightTop");
                      computedW = computedDragAreaSize(false, "width", width);
                      computedH = computedDragAreaSize(true, "height", height);
                    } else {
                      dragComponentRef.current.setDirection("leftTop");
                      computedW = computedDragAreaSize(true, "width", width);
                      computedH = computedDragAreaSize(true, "height", height);
                    }

                    dragComponentRef.current.setAreaSize({ w: computedW, h: computedH });
                    // console.log(dragComponentRef.currnet);
                    return { w: computedW, h: computedH };
                  },
                  100
                );
            }
          }
          break;
        case "onMouseUp":
          noDragState(); // isDrag 변수 설정 (false)
          break;
        case "onMouseLeave":
          if (target.tagName === "TABLE") noDragState(); // isDrag 변수 설정 (false)
          break;
      }
    },
    [isDrag, noDragState]
  );

  useEffect(() => {
    if (isGameOver) noDragState();
  }, [isGameOver, noDragState]);

  return (
    <Wrapper>
      <div className="no-drag">
        <DragComponent
          className="rightBottom"
          isDrag={isDrag}
          ref={dragComponentRef}
          mouseEvent={mouseEventFunction}
          scoreCheck={scoreCheckFunction}
        />
        <Table
          onMouseLeave={(e) => {
            mouseEventFunction(e);
          }}
        >
          <tbody
            id="tbody-area"
            onMouseMove={(e) => {
              mouseEventFunction(e);
            }}
            onMouseUp={(e) => {
              mouseEventFunction(e);
            }}
          >
            {isGameOver ? (
              <GameOverBox />
            ) : (
              <BearListComponent list={list} mouseEvent={mouseEventFunction} scoreCheck={scoreCheckFunction} />
            )}
          </tbody>
        </Table>
      </div>
      {children}
    </Wrapper>
  );
};

export default React.memo(GameTable);
// export default GameTable;
