import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  span {
    border-radius: 20px;
    border: 3px solid #66a7ba;
    margin-left: 10px;
    padding: 0 20px 2px 20px;
  }
`;

const ScoreBox = (props) => {
  const { score } = props;

  return (
    <Wrapper>
      Score
      <span>{score}</span>
    </Wrapper>
  )
}

export default React.memo(ScoreBox);
// export default ScoreBox;