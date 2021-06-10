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

const listPCS = (list) => {
  return list.map((row, idx) => {
    return <tr key={"row-" + idx}>{
      row.map((col, idx) => {
        return <td key={"col-" + idx}>
          <img key={"jelly-" + idx} src={jellyList[getRandomInt(0, jellyList.length)]}/>
          <p>{col}</p>
        </td>
      })
    }</tr>;
  })
}

const test = (e) => {
  console.log(e)
}

const JellyGame = () => {
  let time = 180;
  let score = 0
  let interverId

  console.log('re Rendering')

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
        temp[i].push(getRandomInt(1, 10))
      }
    }
    setList(temp)

    interverId = setInterval(() => {
      time--;
      setTimer(value * time)
      if (time === 0) clearInterval(interverId)
    }, 1000)
  }, [])

  return (
      <div className="game-layout">
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
          <div className="game-table-layout">
            <table className="game-table" onClick={test}>
              <tbody>
              {
                useMemo(() =>
                    listPCS(list), [list]
                )
              }
              </tbody>
            </table>
          </div>
          <div className="timer">
            {
              useMemo(() =>
                  <div className="timer-inner" style={{height: `${timerHeight}px`}}/>, [timerHeight]
              )
            }
          </div>
        </div>
      </div>
  );
}

export default JellyGame;
