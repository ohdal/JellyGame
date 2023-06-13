import React, { useRef, createContext, ReactNode, RefObject } from "react";

import HowToModal, {HowToModalHandle} from "../components/HowToModal";

interface Props {
  children: ReactNode;
}

interface ContextProps {
  modal: RefObject<HowToModalHandle>;
}

export const ModalContext = createContext<ContextProps | null>(null);

export function ModalContainer({ children }: Props) {
  const modalComponentRef = useRef<HowToModalHandle>(null);

  return (
    <ModalContext.Provider value={{ modal: modalComponentRef }}>
      {children}
      <HowToModal ref={modalComponentRef} />
    </ModalContext.Provider>
  );
}
