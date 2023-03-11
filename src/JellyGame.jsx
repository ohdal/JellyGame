import React, { useEffect, useMemo, useState, useCallback } from 'react';
import jelly1 from './assets/images/jelly_type_1.png'
import jelly2 from './assets/images/jelly_type_2.png'
import jelly3 from './assets/images/jelly_type_3.png'
import jelly4 from './assets/images/jelly_type_4.png'
import jelly5 from './assets/images/jelly_type_5.png'
import jelly6 from './assets/images/jelly_type_6.png'
import game_over from './assets/images/gameover.png'
import replay from './assets/images/replay.png'
import './JellyGame.scss'

const jellyList = [jelly1, jelly2, jelly3, jelly4, jelly5, jelly6]

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const createList = () => {
  let temp = []
  for (let i = 0; i < 10; i++) {
    temp.push([])
    for (let j = 0; j < 15; j++) {
      temp[i].push({ visible: true, value: getRandomInt(1, 10), src: jellyList[getRandomInt(0, jellyList.length)] })
    }
  }
  return temp
}

let startBear
const listPCS = (list, MouseEvent, checkBear) => {
  return list.map((row, idxr) => {
    return <tr key={"row-" + idxr}>{
      row.map((col, idxc) => {
        return <td key={"col-" + idxc} id={"bear-" + idxr + "-" + idxc}
          style={{ 'visibility': col.visible ? 'visible' : 'hidden' }}
          onMouseDown={(e) => {
            MouseEvent(e)
            checkBear("bear-" + idxr + "-" + idxc, "Down")
          }}
          onMouseUp={() => { checkBear("bear-" + idxr + "-" + idxc, "Up") }}>
          <img alt="jelly" className="no-drag detection jelly-img" key={"jelly-" + idxc} src={col.src} />
          <p className="detection jelly-number">{col.value}</p>
        </td>
      })
    }</tr>;
  })
}

let startTag
let startClientX
let startClientY
let tbodyRect

let thTimer;
let count = 0;
const throttle = (data, fn, delay) => {
  let w = data.style.width
  let h = data.style.height
  if (!thTimer) {
    //    count++
    //    console.log(count)
    thTimer = setTimeout(() => {
      thTimer = null;
      const temp = fn()

      if (temp.w !== w && temp.h !== h) {
        //        console.log('in')
        //        fn()
      }
    }, delay)
  }
}

let time = 150;
let interverId
const JellyGame = () => {
  const [timerHeight, setTimerHeight] = useState(null)
  const [list, setList] = useState([])
  const [newTag, setNewTag] = useState(null)
  const [score, setScore] = useState(0)
  const [isDrag, setIsDrag] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)
  const [playCnt, setPlayCnt] = useState(0)

  const MouseEvent = useCallback((e) => {
    if (e.target.className.includes("detection")) {
      if (!isDrag && e._reactName === "onMouseDown") {
        //        debugger;
        setIsDrag(true)

        const el = document.getElementById("tbody-area")
        tbodyRect = el.getClientRects()[0]

        startTag = e.target
        startClientX = e.target.parentNode.getClientRects()[0].x
        startClientY = e.target.parentNode.getClientRects()[0].y

        let tempNewTag = document.createElement("div")
        tempNewTag.className = "area rightBottom"
        tempNewTag.style.width = "52px"
        tempNewTag.style.height = "56px"
        startTag.parentNode.appendChild(tempNewTag)
        setNewTag(tempNewTag)
      }

      if (isDrag && e._reactName === "onMouseMove") {
        if (tbodyRect.x > e.clientX || tbodyRect.y > e.clientY) return

        count++
        console.log(count)
        //        throttle(newTag, () => {
        const width = e.clientX - startClientX
        const height = e.clientY - startClientY
        const computedNumber = (isMinus, WH) => {
          const standard = WH.width ? 54 : 58
          const value = WH.width ? WH.width : WH.height

          if (isMinus) return standard * (Math.ceil(value * -1 / standard) + 1)
          else return standard * Math.ceil(value / standard)
        }

        let computedW, computedH
        let temp = document.createElement("div")
        if (width >= 0 && height >= 0) {
          temp.className = "area rightBottom"
          computedW = computedNumber(false, { width })
          computedH = computedNumber(false, { height })
        } else if (width < 0 && height >= 0) {
          temp.className = "area leftBottom"
          computedW = computedNumber(true, { width })
          computedH = computedNumber(false, { height })
        } else if (width >= 0 && height < 0) {
          temp.className = "area rightTop"
          computedW = computedNumber(false, { width })
          computedH = computedNumber(true, { height })
        } else {
          temp.className = "area leftTop"
          computedW = computedNumber(true, { width })
          computedH = computedNumber(true, { height })
        }

        temp.style.width = `${computedW}px`
        temp.style.height = `${computedH}px`
        startTag.parentNode.appendChild(temp)
        newTag.remove()
        setNewTag(temp)

        //          return {dir: temp.className.split(' ')[1], w: computedW, h: computedH,}
        //        }, 50)
      }
    }

    if (e._reactName === "onMouseUp" && isDrag) {
      setIsDrag(false)
    }
  }, [isDrag, newTag])

  const checkBear = useCallback((id, state,) => {
    if (state === "Down") {
      startBear = id.split('-')
    } else {
      if (!newTag) return

      const offsetX = newTag.clientHeight / 58
      const offsetY = newTag.clientWidth / 54
      const cn = newTag.className.split(' ')[1]
      const x = Number(startBear[1])
      const y = Number(startBear[2])
      // start, end
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
        setScore(score + (ei - si) * (ej - sj))
        setList(tempArray)
      }
    }
  }, [score, newTag, list])

  useEffect(() => {
    if (interverId) {
      clearInterval(interverId)
      setScore(0)
      setIsGameOver(false)
      time = 150
    }

    const height = document.getElementsByClassName('timer')[0].clientHeight
    const value = height / time
    setTimerHeight(height)

    setIsLoading(true)
    setList(null)
    setList(createList())

    interverId = setInterval(() => {
      time--;
      setTimerHeight(value * time)
      if (time === 0) {
        clearInterval(interverId)
        setIsGameOver(true)
      }
    }, 1000)

    setIsLoading(false)
  }, [playCnt])

  useEffect(() => {
    if (newTag && !isDrag) {
      newTag.remove()
      setNewTag(null)
    }
  }, [isDrag])

  return (
    <div className="game-layout">
      <div className="game-layout-inner">
        <div id="game-top">
          <div className="replay">
            <a onClick={() => {
              setPlayCnt(p => p + 1)
            }}>
              Replay<img alt="replay" src={replay} /></a>
          </div>
          {
            useMemo(() =>
              <div className="score">
                Score
                <span>{score}</span>
              </div>, [score])
          }
        </div>
        <div id="game-content">
          <div className="game-table-layout no-drag">
            <table className="game-table">
              <tbody id="tbody-area" onMouseMove={MouseEvent} onMouseUp={MouseEvent}>
                {
                  useMemo(() =>
                    isGameOver ?
                      <tr>
                        <td className="gameover-layout">
                          <div className="gameover-img"><img alt="" src={game_over} /></div>
                          <div className="gameover-text"><p>{score}</p></div>
                        </td>
                      </tr>
                      : listPCS(list, MouseEvent, checkBear), [isGameOver, list, newTag]
                  )
                }
              </tbody>
            </table>
            <div className="detection-area top" onMouseEnter={() => { setIsDrag(false) }} />
            <div className="detection-area left" onMouseEnter={() => { setIsDrag(false) }} />
            <div className="detection-area right" onMouseEnter={() => { setIsDrag(false) }} />
            <div className="detection-area bottom" onMouseEnter={() => { setIsDrag(false) }} />
          </div>
          {useMemo(() =>
            <div className="timer">
              <div className="timer-inner" style={{ height: `${timerHeight}px` }} />
            </div>, [timerHeight])}
        </div>
      </div>
    </div>
  );
}

export default React.memo(JellyGame);
