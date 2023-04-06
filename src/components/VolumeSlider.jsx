import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

import icon_volume from '../assets/images/volume.png'
import icon_volume_zero from '../assets/images/volume_zero.png'
import cursor_pointer from '../assets/images/pointer.png'

const Wrapper = styled.div`
  button {
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    outline: none;
    padding: 0;
    transform: translate(0, 10px);
  }

  input[type="range"] {
    background: linear-gradient(to right, #66a7ba 0%, #66a7ba ${props => props.per}%, #171a1e ${props => props.per}%, #171a1e 100%) !important;
  }
`

export default function VolumeSlider({ defaultVolume, changeVolume }) {
  const [value, setValue] = useState(defaultVolume * 100);

  const handleOnChange = useCallback((v) => {
    setValue(v);
    changeVolume(v * 0.01);
  }, [changeVolume])

  return (
    <Wrapper per={value} pointer={cursor_pointer}>
      <button onClick={() => { handleOnChange(!value ? 40 : 0) }}>
        <img alt="volume" className="pointer"
          width="30px" height="30px" src={value > 0 ? icon_volume : icon_volume_zero} />
      </button>
      <input type="range" min={0} max={100} value={value}
        onChange={(e) => { handleOnChange(e.target.value); }} />
    </Wrapper>
  )
}