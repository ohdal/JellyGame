import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 52px;
  height: 52px;
  position: absolute;
  border: 1px solid #61dafb;
  background: #66a7ba;
  z-index: 1;
  top: 13px;
  left: 13px;
`;

const DragComponent = forwardRef((props, ref) => {
  const { isDrag, mouseEvent, checkBear } = props;

  const [dir, setDir] = useState("rightBottom");
  const [width, setWidth] = useState(52);
  const [height, setHeight] = useState(56);
  const [xPos, setXPos] = useState(-1);
  const [yPos, setYPos] = useState(-1);

  useImperativeHandle(ref, () => ({
    getAreaSize,
    setAreaSize,
    getDirection,
    setDirection,
    getAreaPos,
    setAreaPos,
  }))

  const getAreaSize = useCallback(() => {
    return { width, height };
  }, [width, height])

  const setAreaSize = useCallback(({ h, w }) => {
    // 한번더 isDrag 체크
    // throttle 기능 때문에 isDrag가 false인데
    // default size가 아닌 큰 사이즈로 변경시키도록 호출된다 🥲.
    if (isDrag) {
      setHeight(h);
      setWidth(w);
    } else {
      setHeight(56);
      setWidth(52);
    }
  }, [isDrag])

  const getDirection = useCallback(() => {
    return dir;
  }, [dir])

  const setDirection = (str) => {
    setDir(str);
  }

  const getAreaPos = useCallback(() => {
    return { x: xPos, y: yPos };
  }, [xPos, yPos])

  const setAreaPos = ({ x, y }) => {
    // console.log('Pos', x, y)
    setXPos(x);
    setYPos(y);
  }

  const computedPos = useCallback(() => {
    // table border-spacing => 2px
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

  useEffect(() => {
    if (!isDrag) {
      setAreaSize({ h: 56, w: 52 });
      setAreaPos({ x: -1, y: -1 });
    }
  }, [isDrag, setAreaSize])

  return (
    <Wrapper
      className={dir}
      style={{
        opacity: isDrag ? 0.5 : 0,
        width: `${width}px`,
        height: `${height}px`,
        transform: computedPos(),
      }}
      onMouseUp={(e) => {
        mouseEvent(e);
        checkBear(null, "Up");
      }}
    />
  )
})

export default DragComponent;
