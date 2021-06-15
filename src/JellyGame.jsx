import React, {useEffect, useMemo, useState} from 'react';
import jelly1 from './assets/images/jelly_type_1.png'
import jelly2 from './assets/images/jelly_type_2.png'
import jelly3 from './assets/images/jelly_type_3.png'
import jelly4 from './assets/images/jelly_type_4.png'
import jelly5 from './assets/images/jelly_type_5.png'
import jelly6 from './assets/images/jelly_type_6.png'
import replay from './assets/images/replay.png'
import './JellyGame.scss'

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6]

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let startBear
const checkBear = (id, state, list, setList) => {
  if (state === "Down") {
    startBear = id.split('-')
  } else {
    const offsetX = newTag.clientHeight / 58
    const offsetY = newTag.clientWidth / 54
    const cn = newTag.className.split(' ')[1]
    const x = Number(startBear[1])
    const y = Number(startBear[2])
    let si, ei, sj, ej
    switch (cn) {
      case "rightBottom":
        si = x
        ei = x + offsetX
        sj = y
        ej = y + offsetY
        break;
      case "rightTop":
        si = x - offsetX + 1
        ei = x + 1
        sj = y
        ej = y + offsetY
        break;
      case "leftBottom":
        si = x
        ei = x + offsetX
        sj = y - offsetY + 1
        ej = y + 1
        break;
      case "leftTop":
        si = x - offsetX + 1
        ei = x + 1
        sj = y - offsetY + 1
        ej = y + 1
        break;
      default:
        break;
    }
    let count = 0
    let tempArray = JSON.parse(JSON.stringify(list))
    for (let i = si; i < ei; i++) {
      for (let j = sj; j < ej; j++) {
        if (list[i][j].visible) {
          count += list[i][j].value
          tempArray[i][j].visible = false
        }
      }
    }

    if (count === 10) {
      setList(tempArray)
    }
  }
}

const listPCS = (list, setList) => {
  return list.map((row, idxr) => {
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc} id={"bear-" + idxr + "-" + idxc}
                   style={{'visibility': col.visible ? 'visible' : 'hidden'}}
                   onMouseDown={() => {
                     checkBear("bear-" + idxr + "-" + idxc, "Down", list, (value) => {setList(value)})
                   }}
                   onMouseUp={() => {checkBear("bear-" + idxr + "-" + idxc, "Up", list, (value) => {setList(value)})}}>
          <img className="no-drag detection" key={"jelly-" + idxc} src={col.src}/>
          <p className="detection">{col.value}</p>
        </td>
      })
    }</tr>;
  })
}

let isDrag = false
let startTag
let startClientX
let startClientY
let tbodyRect
let newTag
const MouseEvent = (e) => {
  if (e.target.className.includes("detection")) {
    if (!isDrag && e._reactName === "onMouseDown") {
      isDrag = true

      const el = document.getElementById("tbody-area")
      tbodyRect = el.getClientRects()[0]

      startTag = e.target
      startClientX = e.target.parentNode.getClientRects()[0].x
      startClientY = e.target.parentNode.getClientRects()[0].y

      newTag = document.createElement("div")
      startTag.parentNode.appendChild(newTag)
      newTag.className = "area rightBottom"
      newTag.style.width = "52px"
      newTag.style.height = "56px"
    }

    if (isDrag && e._reactName === "onMouseMove") {
      if (tbodyRect.x > e.clientX || tbodyRect.y > e.clientY) return

      const width = e.clientX - startClientX
      const height = e.clientY - startClientY
      const computedNumber = (isMinus, WH) => {
        const standard = WH.width ? 54 : 58
        const value = WH.width ? WH.width : WH.height

        if (isMinus) return standard * (Math.ceil(value * -1 / standard) + 1)
        else return standard * Math.ceil(value / standard)
      }

      let computedW, computedH
      if (width >= 0 && height >= 0) {
        if (!newTag.className.includes("rightBottom")) newTag.className = "area rightBottom"
        computedW = computedNumber(false, {width})
        computedH = computedNumber(false, {height})
      } else if (width < 0 && height >= 0) {
        if (!newTag.className.includes("leftBottom")) newTag.className = "area leftBottom"
        computedW = computedNumber(true, {width})
        computedH = computedNumber(false, {height})
      } else if (width >= 0 && height < 0) {
        if (!newTag.className.includes("rightTop")) newTag.className = "area rightTop"
        computedW = computedNumber(false, {width})
        computedH = computedNumber(true, {height})
      } else {
        if (!newTag.className.includes("leftTop")) newTag.className = "area leftTop"
        computedW = computedNumber(true, {width})
        computedH = computedNumber(true, {height})
      }

      newTag.style.width = `${computedW}px`
      newTag.style.height = `${computedH}px`

    }
  }

  if (e._reactName === "onMouseUp" || e.type === 'mouseup') {
    isDrag = false
    if (newTag) newTag.remove()
  }
}

const JellyGame = () => {
  let time = 180;
  let score = 0
  let interverId

  const [timerHeight, setTimerHeight] = useState(null)
  const [list, setList] = useState([])

  const setTimer = (value) => {
    setTimerHeight(value)
  }

  useEffect(() => {
    const height = document.getElementsByClassName('timer')[0].clientHeight
    const value = height / time
    setTimerHeight(height)

    let temp = []
    for (let i = 0; i < 10; i++) {
      temp.push([])
      for (let j = 0; j < 15; j++) {
        temp[i].push({visible: true, value: getRandomInt(1, 10), src: jellyList[getRandomInt(0, jellyList.length)]})
      }
    }
    setList(temp)

    interverId = setInterval(() => {
      time--;
      setTimer(value * time)
      if (time === 0) clearInterval(interverId)
    }, 1000)

    window.addEventListener('mouseup', e => {
      MouseEvent(e)
    })
  }, [])

  return (
      <div className="game-layout" onMouseUp={MouseEvent}>
        <div id="game-top">
          <div className="replay">
            <p>Replay<img src={replay}/></p>
          </div>
          <div className="score">
            <p>
              Score
              <span>{score}</span>
            </p>
          </div>
        </div>
        <div id="game-content">
          <div className="game-table-layout no-drag">
            <table className="game-table">
              <tbody id="tbody-area" onMouseDown={MouseEvent} onMouseMove={MouseEvent}>
              {
                useMemo(() =>
                    listPCS(list, setList), [list]
                )
              }
              </tbody>
            </table>
          </div>
          {useMemo(() =>
              <div className="timer">
                <div className="timer-inner" style={{height: `${timerHeight}px`}}/>
              </div>, [timerHeight])}
        </div>
      </div>
  );
}

export default React.memo(JellyGame);
