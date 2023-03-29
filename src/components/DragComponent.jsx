import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 52px;
  height: 52px;
  position: absolute;
  border: 1px solid #61dafb;
  background: #66a7ba;
  z-index: 1;

  &.rightBottom {
    top: 13px;
    left: 13px;
  }

  &.rightTop {
    bottom: 13px;
    left: 13px;
  }

  &.leftBottom {
    top: 13px;
    right: 13px;
  }

  &.leftTop {
    bottom: 13px;
    right: 13px;
  }
`;

const DragComponent = forwardRef((props, ref) => {
  const { isDrag } = props;

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

  const getAreaSize = () => {
    return { width, height };
  }

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

  const getDirection = () => {
    return dir;
  }

  const setDirection = (str) => {
    setDir(str);
  }

  const getAreaPos = () => {
    return { x: xPos, y: yPos };
  }

  const setAreaPos = ({ x, y }) => {
    console.log('Pos', x, y)
    setXPos(x);
    setYPos(y);
  }

  const computedPos = useCallback(() => {
    // table border-spacing => 2px
    const xDif = 2 * yPos;
    const yDif = 2 * xPos;
    return `translate(${yPos * 52 + xDif}px, ${xPos * 56 + yDif}px)`;
  }, [xPos, yPos, dir])

  useEffect(() => {
    if (!isDrag) {
      setAreaSize({ h: 56, w: 52 });
      setAreaPos({ x: -1, y: -1 });
    }
  }, [isDrag])

  return (
    <Wrapper
      className={dir}
      style={{
        opacity: isDrag ? 0.5 : 0.2,
        width: `${width}px`,
        height: `${height}px`,
        transform: computedPos(),
      }}
    />
  )
})

export default DragComponent;
