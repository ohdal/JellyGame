import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

import gif_howto_1 from "../assets/images/howto_1.gif";
import gif_howto_2 from "../assets/images/howto_2.gif";
import gif_howto_3 from "../assets/images/howto_3.gif";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
`;

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  padding: 15px;
  background: #171a1e;
  border: 3px solid #66a7ba;
  border-radius: 10px;
  z-index: 1100;
`;

const Header = styled.div`
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #66a7ba;

  .button-layout {
    float: right;

    .cancle-btn {
      vertical-align: top;
      width: 30px;
      height: 30px;
      background: #66a7ba;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      font-weight: bold;
      color: #171a1e;
    }
  }
`;

const Content = styled.div<{ ref: React.RefObject<HTMLDivElement> }>`
  width: 100%;
  height: calc(100% - 48px);
  padding-top: 10px;
  overflow-wrap: anywhere;
  overflow-y: auto;
  text-align: center;
  color: #66a7ba;
  font-size: 15px;
  font-weight: 500;

  title {
    font-size: 20px;
    font-weight: 600;

    span {
      color: #faa3a3;
    }
  }
`;

const ImgLayout = styled.div`
  position: relative;
  width: 300px;
  height: 250px;
  margin: 10px auto 40px auto;
  overflow: hidden;

  img {
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface Props {}

export type HowToModalHandle = {
  toggle: () => void;
};

const HowToModal = forwardRef<HowToModalHandle, Props>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    toggle,
  }));

  // 기능 : HowToModal.jsx 컴포넌트 toggle & scrollTop 초기화
  // 인자 : 없음
  const toggle = useCallback(() => {
    setVisible((v) => !v);
    if (visible && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [visible]);

  return (
    <Wrapper style={{ display: visible ? "block" : "none" }}>
      <Modal>
        <Header>
          HOW TO ?
          <div className="button-layout">
            <button className="cancle-btn" onClick={toggle}>
              x
            </button>
          </div>
        </Header>
        <Content ref={contentRef}>
          <p className="title">
            제한시간 <span>150초</span> 내에 최대한 많은 젤리를 없애보세요 🤩
          </p>
          <ul>
            <li>
              드래그한 젤리 숫자의 합이 10인 경우, 젤리를 없앨 수 있어요.
              <br />
              <ImgLayout>
                <img alt="img" src={gif_howto_1} width="100%" height="100%" />
              </ImgLayout>
            </li>
            <li>
              점수는 젤리 갯수에따라 카운트 되요.
              <br />
              <ImgLayout>
                <img alt="img" src={gif_howto_2} width="100%" height="100%" />
              </ImgLayout>
            </li>
            <li>
              언제든 다시 시작할 수 있어요.
              <br />
              <ImgLayout>
                <img alt="img" src={gif_howto_3} width="100%" height="100%" />
              </ImgLayout>
            </li>
          </ul>
        </Content>
      </Modal>
    </Wrapper>
  );
});

export default HowToModal;
