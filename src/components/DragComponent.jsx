import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
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

  useImperativeHandle(ref, () => ({
    getAreaSize,
    setAreaSize,
    getDirection,
    setDirection,
  }))

  const getAreaSize = () => {
    return { width, height };
  }

  const setAreaSize = ({ h, w }) => {
    setHeight(h);
    setWidth(w);
  }

  const getDirection = () => {
    return dir;
  }

  const setDirection = (str) => {
    setDir(str);
  }

  useEffect(() => {
    if (!isDrag)
      setAreaSize({ h: 56, w: 52 });
  }, [isDrag])

  return (
    <Wrapper
      className={dir}
      style={{
        opacity: isDrag ? 0.5 : 0,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  )
})

export default DragComponent;
