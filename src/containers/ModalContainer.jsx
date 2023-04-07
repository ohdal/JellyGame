import React, { useRef, createContext } from 'react'

import HowToModal from '../components/HowToModal';

export const ModalContext = createContext(null);

export function ModalContainer({ children }) {
  const modalComponentRef = useRef();

  return (
    <ModalContext.Provider value={{ modal: modalComponentRef }}>
      {children}
      <HowToModal ref={modalComponentRef} />
    </ModalContext.Provider>
  )
}
