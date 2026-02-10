'use client'
import styles from '@/app/styles/CircularLayout.module.css'
import { useState, useEffect } from 'react';
import { generateSoln } from './actions';
import { redirect, RedirectType } from "next/navigation";

export default function Page(){
  const runeCount = 2;
  const [runes, setRunes] = useState(Array.from({ length: runeCount }, (_, i) => false));
  const [litRunes, setLitRunes] = useState(0);
  const [solution, setSol] = useState([]);

  useEffect(() => {
    async function initSoln() {
      setSol(await generateSoln(runeCount));
    }
    initSoln();
  }, []);

  if(litRunes == runeCount) {
    setTimeout(() => {
      redirect('/level_0', RedirectType.replace)
    }, 2500)
  }

  function handleClick(clickedRune) {
    if (clickedRune == solution[litRunes]){
      setLitRunes(litRunes+1);
      setRunes(runes.map((rune, ind) => (ind == clickedRune)? true : rune));
    } 
    else {
      setLitRunes(0);
      setRunes(runes.fill(false));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainCircle} style={{"--solve-progress": litRunes/runeCount}}>
        <div className={`${styles['centre-rune']} ${(litRunes == runeCount)? styles.solved : ""}` }></div>

        {runes.map((rune, ind) => (
          <button 
            key={ind}
            className={`${(rune)? styles.lit : styles.innerCircle} ${(litRunes == runeCount)? styles.solved : ""}`}
            style={{
              transform: `rotate(${ind * (360/runeCount)}deg) translateY(-20vw)`,
            }}
            onClick={e => { e.stopPropagation(); handleClick(ind)}}
          >
          </button>
        ))}
      </div>
    </div>
  );
}