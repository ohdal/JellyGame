import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle} from 'react'
import styled from 'styled-components'
import { MouseEventFunction, ScoreCheckFunction } from './GameTable';

const Wrapper = styled.div`
  width: 52px;
  height: 52px;
  position: absolute;
  border: 1px solid #61dafb;
  background: #66a7ba;
  z-index: 2;
  top: 13px;
  left: 13px;
`;

interface Props {
  className: string;
  isDrag: boolean;
  mouseEvent: MouseEventFunction;
  scoreCheck: ScoreCheckFunction;
}

type GetAreaSizeType = () => {width: number, height: number};
type SetAreaSizeType = (data: {w: number, h: number}) => void;
type GetDirectionType = () => string;
type SetDirectionType = (dir: string) => void;
type GetAreaPosType = () => {x: number, y: number};
type SetAreaPosType = (data: {x: number, y: number}) => void;

export type DragComponentHandle = {
  getAreaSize: GetAreaSizeType;
  setAreaSize: SetAreaSizeType;
  getDirection: GetDirectionType;
  setDirection: SetDirectionType,
  getAreaPos: GetAreaPosType,
  setAreaPos: SetAreaPosType,
};

const DragComponent = forwardRef<DragComponentHandle, Props>((props, ref) => {
  const { isDrag, mouseEvent, scoreCheck } = props;

  const [dir, setDir] = useState("rightBottom"); // 사용자 드래그 방향 string
  const [width, setWidth] = useState(52); // 드래그 컴포넌트 너비 number
  const [height, setHeight] = useState(56); // 드래그 컴포넌트 높이 number
  const [xPos, setXPos] = useState(-1); // 드래그 컴포넌트 위치 x 값 number
  const [yPos, setYPos] = useState(-1); // 드래그 컴포넌트 위치 y 값 number

  useImperativeHandle(ref, () => ({
    getAreaSize,
    setAreaSize,
    getDirection,
    setDirection,
    getAreaPos,
    setAreaPos,
  }))

  // 기능 : width, height statea 값 반환
  // 인자 : 없음
  const getAreaSize: GetAreaSizeType = useCallback(() => {
    return { width, height };
  }, [width, height])

  // 기능 : width, height state 값 반환
  // 인자 : 없음
  const setAreaSize: SetAreaSizeType = useCallback(({ w, h }) => {
    /* 
    한번더 isDrag 체크하기
    throttle 기능 때문에 isDrag가 false인데
    default size가 아닌 큰 사이즈로 변경시키도록 호출된다 🥲.
    */
    if (isDrag) {
      setHeight(h);
      setWidth(w);
    } else {
      setHeight(56);
      setWidth(52);
    }
  }, [isDrag])

  // 기능 : dir state 값 반황
  // 인자 : 없음
  const getDirection: GetDirectionType = useCallback(() => {
    return dir;
  }, [dir])

  // 기능 : dir state 값 변경
  // 인자 : 변경값 string
  const setDirection: SetDirectionType = useCallback((dir) => {
    setDir(dir);
  }, [])

  // 기능 : xPos, yPos state 값 반환
  // 인자 : 없음
  const getAreaPos: GetAreaPosType = useCallback(() => {
    return { x: xPos, y: yPos };
  }, [xPos, yPos])

  // 기능 : xPos, yPos state 값 변경
  // 인자 : xPos 값 x number, yPos 값 y number
  const setAreaPos: SetAreaPosType = useCallback(({ x, y }) => {
    setXPos(x);
    setYPos(y);
  }, [])

  // 기능 : dir state값에 따라 계산된 위치 값 반환
  // 인자 : 없음
  const computedPos = useCallback(() => {
    // table border-spacing 때문에
    // 2px씩 차이나는 값을 계산해서 더해준다.
    const xDif = 2 * yPos;
    const yDif = 2 * xPos;
    let resultX = yPos * 52 + xDif, resultY = xPos * 56 + yDif;

    let { width, height } = getAreaSize();

    switch (dir) {
      case "rightTop":
        resultY -= (height - 56);
        break;
      case "leftBottom":
        resultX -= (width - 52);
        break;
      case "leftTop":
        resultX -= (width - 52);
        resultY -= (height - 56);
        break;
      default:
        break;
    }

    return `translate(${resultX}px, ${resultY}px)`;
  }, [xPos, yPos, dir, getAreaSize])

  // 역할 : DragComponent.jsx 사이즈, 위치 초기화
  useEffect(() => {
    /* 
    z-index속성이 1이고 최적화때문에 opacity 속성을 사용.
    따라서 마우스 이벤트가 제대로 발생하지 않기 때문에
    반드시 사이즈와 위치를 초기화 시켜줘야 한다.
    */
    if (!isDrag) {
      setAreaSize({ h: 56, w: 52 });
      setAreaPos({ x: -1, y: -1 });
    }
  }, [isDrag, setAreaSize, setAreaPos])

  return (
    <Wrapper
      className={`detection ${dir}`}
      style={{
        opacity: isDrag ? 0.5 : 0,
        width: `${width}px`,
        height: `${height}px`,
        transform: computedPos(),
      }}
      onMouseUp={(e) => {
        mouseEvent(e);
        scoreCheck(null, null, "Up");
      }}
      onMouseMove={(e) => {
        mouseEvent(e);
      }}
    />
  )
})

export default DragComponent;
