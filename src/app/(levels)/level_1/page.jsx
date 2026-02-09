'use client'
import styles from '@/app/styles/CircularLayout.module.css'
import { useState, useEffect } from 'react';
import { generateSoln } from './actions';

export default function Page(){
  const len = 6
  const [runes, setRunes] = useState(Array.from({ length: len }, (_, i) => false));
  const [litRunes, setLitRunes] = useState(0);
  const [solution, setSol] = useState([]);

  useEffect(() => {
    async function initSoln() {
      setSol(await generateSoln(len));
    }
    initSoln();
  }, []);

  function handleClick(clickedRune) {
    if (clickedRune == solution[litRunes]){
      setLitRunes(litRunes+1);
      setRunes(runes.map((rune, ind) => (ind == clickedRune)? true : rune));
    } 
    else {
      console.log("wring")
      console.log(solution);
      setLitRunes(0);
      setRunes(runes.fill(false));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainCircle}>
        {runes.map((rune, ind) => (
          <button 
            key={ind}
            className={(rune)? styles.lit : styles.innerCircle}
            style={{
              transform: `rotate(${ind * (360/len)}deg) translateY(-20vw)`,
            }}
            onClick={e => { e.stopPropagation(); handleClick(ind)}}
          >
            {ind}
          </button>
        ))}
      </div>
    </div>
  );
}