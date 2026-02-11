"use client"

/*
TODO: use nextjs img component
TODO: fix styling
TODO: replace DOM maniulation with conditional rendering
*/

/*
Flow:
user click on initiate -> fade out hud and intro

start loading
stop at rage value
*/


import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Landing.module.css';
import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  const [rageValue] = useState((Math.random() * 100).toFixed(2));
  const [gameState, setGameState] = useState('intro'); // intro, loading, alarm, verify
  const [currentDisplayValue, setCurrentDisplayValue] = useState(0);
  const [alarmCount, setAlarmCount] = useState(0);
  const [countdownDisplay, setCountdownDisplay] = useState('0.0');
  const [alarmNodes, setAlarmNodes] = useState([]);
  const [userInput, setUserInput] = useState('');

  const timerIntervalRef = useRef(null);
  const loadIntervalRef = useRef(null);
  const alarmCountRef = useRef(0);
  const totalAlarmsNeeded = 8;

  const startLandingSequence = () => {
    const planet = document.querySelector(`.${styles.planet}`);
    const hud = document.querySelector(`.${styles['hud-layer']}`);
    const introCard = document.getElementById('intro-card');

    planet.classList.add(styles['planet-zoom']);
    introCard.style.opacity = '0';
    hud.style.opacity = '0';

    setTimeout(() => {
      setGameState('loading');
      startLoading();
    }, 2500);
  };

  const startLoading = () => {
    /*  */

    let displayVal = 0;

    loadIntervalRef.current = setInterval(() => {
      let increment = Math.random() * 2.5;
      displayVal += increment;

      if (displayVal >= parseFloat(rageValue)) {
        setCurrentDisplayValue(parseFloat(rageValue));
        clearInterval(loadIntervalRef.current);

        setTimeout(() => {
          triggerEmergency();
        }, 3000);
      } else {
        setCurrentDisplayValue(displayVal);
      }
    }, 50);
  };



  const triggerEmergency = () => {
    if (gameState === 'alarm') return;
    setGameState('alarm');
    document.body.classList.add(styles['alarm-state']);

    let calcValue = parseFloat(rageValue) / 10;
    let timeLimit = (calcValue >= 0 && calcValue <= 5) ? 6 : 9;

    startTimer(timeLimit);
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
    alarmCountRef.current = 0;
    setAlarmCount(0);
    spawnNextAlarmNode(0);
  };

  const startTimer = (seconds) => {
    let remainingTime = seconds;
    setCountdownDisplay(remainingTime.toFixed(1));

    timerIntervalRef.current = setInterval(() => {
      remainingTime -= 0.1;
      setCountdownDisplay(remainingTime.toFixed(1));

      if (remainingTime <= 0) {
        clearInterval(timerIntervalRef.current);
        setCountdownDisplay('0.0');
        alert('HULL BREACH DETECTED. MISSION FAILED.');
        window.location.reload();
      }
    }, 100);
  };

  const spawnNextAlarmNode = (count) => {
    if (count >= totalAlarmsNeeded) {
      stabilizeShip();
      return;
    }

    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 120;

    const randomX = Math.max(40, Math.floor(Math.random() * maxX));
    const randomY = Math.max(100, Math.floor(Math.random() * maxY));

    setAlarmNodes([{ id: `node-${count}-${Date.now()}`, x: randomX, y: randomY, index: count }]);
  };

  const handleAlarmNodeClick = (e, nodeId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setAlarmNodes(prev => {
      const activeNode = prev.find(n => n.id === nodeId);
      if (!activeNode) return prev;

      const nextCount = alarmCountRef.current + 1;
      alarmCountRef.current = nextCount;
      setAlarmCount(nextCount);

      if (navigator.vibrate) navigator.vibrate(50);

      // Schedule next spawn
      setTimeout(() => spawnNextAlarmNode(nextCount), 0);

      return [];
    });
  };

  const stabilizeShip = () => {
    clearInterval(timerIntervalRef.current);
    document.body.classList.remove(styles['alarm-state']);
    setGameState('verify');
    setAlarmNodes([]);
  };

  const checkRageValue = () => {
    if (parseFloat(userInput).toFixed(2) === rageValue) {
      redirect('/level2/backstory_1', RedirectType.replace)
    } else {
      alert(`ACCESS DENIED.\nRequired: ${rageValue}%`);
      window.location.reload();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(loadIntervalRef.current);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className={styles['crt-overlay']}></div>

      <div id="game-world">
        <div className={styles['planet-background']}>
          <div className={styles.planet}></div>
        </div>

        <div className={styles['hud-layer']}>
          <div className={styles['hud-top']}>
            <span>ORBITAL TRAJECTORY: <span className={styles.blink}>LOCKED</span></span>
            <span>T-MINUS 00:02:00</span>
          </div>

          <div className={styles['hud-left']}>
            <div className={styles['hud-item']}>
              <label>OXYGEN LEVELS</label>
              <div className={styles['bar-container']}>
                <div className={styles['bar-fill']} style={{ width: '82%' }}></div>
              </div>
              <span className={styles.value}>82%</span>
            </div>
            <div className={styles['hud-item']}>
              <label>HULL INTEGRITY</label>
              <span className={`${styles.value} ${styles['critical-text']}`}>CRITICAL</span>
            </div>
          </div>

          <div className={styles['hud-right']}>
            <div className={styles['hud-item']}>
              <label>GRAVITY</label>
              <span className={`${styles.value} ${styles.large}`}>1.2G</span>
            </div>
          </div>

          <div className={styles['hud-bottom']}>
            <span>COORDINATES: 42.91° N, 12.33° W</span>
            <span>DATA LINK: <span className={styles['online-dot']}>●</span> ONLINE</span>
          </div>
        </div>

        <div className={styles['center-content']}>
          {gameState === 'intro' && (
            <div className={`${styles.card} ${styles['warning-card']}`} id="intro-card">
              <div className={styles['icon-warning']}>⚠️</div>
              <h2>WARNING: APPROACHING<br />PLANETARY ORBIT</h2>
              <p>
                Atmospheric entry may result in structural failure.<br />Environmental
                hazards detected.<br />Proceed with caution.
              </p>
              <button onClick={startLandingSequence} className={styles['action-btn']}>
                ✈ INITIATE LANDING SEQUENCE
              </button>
            </div>
          )}

          {gameState === 'verify' && (
            <div className={`${styles.card} ${styles['warning-card']}`}>
              <span className={styles['section-label']}>SECURITY LOCKOUT</span>
              <h2>STABILIZATION COMPLETE</h2>
              <p>
                System rebooted. Enter the <b>thruster calibration percentage</b> to
                unlock controls.
              </p>
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                step="0.01"
                inputMode="decimal"
                placeholder="00.00"
                className={styles['rage-input']}
              />
              <button onClick={checkRageValue} className={styles['rage-submit']}>
                UNLOCK CONTROLS
              </button>
            </div>
          )}
        </div>

        {gameState === 'loading' && (
          <div id="loading-container" className={styles['loading-container']}>
            <div className={`${styles.card} ${styles['warning-card']}`} id="status-card">
              <span className={styles['section-label']}>SYSTEM INITIALIZATION</span>
              <h1 id="loading-text" className={styles['loading-text']}>{currentDisplayValue.toFixed(2)}%</h1>
              <p className={styles['blink-text']}> CALIBRATING THRUSTERS...</p>
            </div>
          </div>
        )}

        {gameState === 'alarm' && (
          <div id="alarm-overlay">
            <div id="countdown-display">{countdownDisplay}</div>
            {alarmNodes.map(node => (
              <div
                key={node.id}
                className={styles['alarm-node']}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onPointerDown={(e) => handleAlarmNodeClick(e, node.id)}
              >
                TAP!
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
