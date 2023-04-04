import React from 'react'
import styled from 'styled-components'

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  background: #171a1e;
  border: 3px solid #66a7ba;
  border-radius: 10px;
  display: none;
  z-index: 1000;
`

export default function HowToModal() {
  return (
    <Modal>HowToModal</Modal>
  )
}
