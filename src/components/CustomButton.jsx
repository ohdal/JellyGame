import React from 'react'
import styled from 'styled-components';

const Button = styled.button`
  position: relative;
  width: 100px;
  height: 35px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  text-align: left;

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    transform: translate(0, -3px);
  }

  &:hover {
    font-size: 22px;
  }
`;

export default function CustomButton({ clickFunc, children }) {
  return (
    <Button onClick={clickFunc}>
      {children}
    </Button>
  )
}
