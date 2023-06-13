import React from "react";
import styled from "styled-components";

import jellyImg3 from "../assets/images/jelly_type_3.png";
import jellyImg5 from "../assets/images/jelly_type_5.png";
import jellyImg6 from "../assets/images/jelly_type_6.png";

const Wrapper = styled.div`
  font-size: 1.25rem;
  color: #ffffff;
  margin: auto 0;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
`;

export default function MobilePage() {
  return (
    <Wrapper>
      <ImageContainer>
        <img src={jellyImg3} alt="" width="50vw" height="50vh" />
        <img src={jellyImg5} alt="" width="50vw" height="50vh" />
        <img src={jellyImg6} alt="" width="50vw" height="50vh" />
      </ImageContainer>
      Mobile 버전은 이용하실 수 없습니다. <br />
      PC로 접속해주세요. 🥺
    </Wrapper>
  );
}
