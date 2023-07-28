import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Die from './Die'
import './App.css'

function App() {
  const [dice, setDice] = useState(newDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(1)
  const [timer, setTimer] = useState(0)
  const [startedTimer, setStartedTimer] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameStats, setGameStats] = useState({
    tenzies: Number(localStorage.getItem("tenzies")) || null,
    tenziesTime: Number(localStorage.getItem("tenziesTime")) || null
    })
    
  function startGame() {
    setGameStarted(true)  
    setStartedTimer(true)  
  }
  let intervalId
  useEffect(() => {
    if (startedTimer) {
      intervalId = setInterval(() => {
        setTimer(prevCount => prevCount + 1);
      }, 1000);
    } else if (tenzies) {
      clearInterval(intervalId); // Clear the interval when gameStarted is false
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [startedTimer]);


  function createDie() {
    return {
      number: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
      id: nanoid()
    }
  }

  function newDice() {
    const newArr = []

    let i = 0;
    while(i++ < 10) {
      newArr.push(createDie())
    }
    return newArr
  }

  useEffect(()=> {
    let sameDice = dice.every(die=> die.number === dice[0].number)
    let allHeld = dice.every(die=> die.isHeld)

    if (sameDice && allHeld) {
      setTenzies(true)
      setStartedTimer(false)

      
      if (!gameStats.tenzies || gameStats.tenzies > rollCount) {
        localStorage.setItem("tenzies", rollCount.toString())
        setGameStats(prevState => {
          return {...prevState, tenzies: rollCount}})
      }

      if (!gameStats.tenziesTime || gameStats.tenziesTime > timer) {
        localStorage.setItem("tenziesTime", timer.toString())
        setGameStats(prevState => {
         return {...prevState, tenziesTime: timer}})
      }

    } else {
      setTenzies(false)
    }

  }, [dice])

  function toggleHold(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  function rollTheDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : createDie()
      }))
  
      setRollCount(prevState => prevState+1)
    } else {
      // NEW GAME SETUP
      setGameStarted(false)
      setTenzies(false)
      setDice(newDice())
      setRollCount(1)
      setTimer(0)
    }
  }

  const diceElements = dice.map(die => {
    return <Die key={die.id}
                id={die.id}
                className={`dice die-${die.number}`}
                number={die.number}
                isHeld={die.isHeld}
                toggleHold={toggleHold}
            />
  })

  return (
    <>
      <main>
    { tenzies && <Confetti /> }
        <h1>Tenzies</h1>
        {!gameStarted && <img className='die_logo' src="/assets/images/dice.png" alt="" />}
        <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        
        {gameStarted ? (
          <div>
            <div className="dice_container">
              {diceElements}
            </div>
            <small className="roll_count">{tenzies ? "You have won in " : "Roll count: "}
            <span>{rollCount}</span>
            {tenzies ? " rolls" : ""}</small>

            <small className="roll_count">Time: <span>{timer}</span> seconds</small>
            <button onClick={rollTheDice}>{tenzies ? "New game" : "Roll"}</button>
          </div>
        ) : (
          <button onClick={startGame}>START GAME</button>
        )}

        <div className="stats">
          <small>Lowest roll count: <span>{gameStats.tenzies ? gameStats.tenzies : "___" }</span></small>
          <small>Fastest tenzies: <span>{gameStats.tenziesTime ? gameStats.tenziesTime + " seconds" : "___"}</span></small>
        </div>
      </main>
    </>
  )
}

export default App
