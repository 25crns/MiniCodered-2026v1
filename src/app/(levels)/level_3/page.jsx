"use client"
// TODO: redirect to correct page (line 183)


import { useEffect, useRef, useState} from "react";
import { redirect, RedirectType } from "next/navigation";
import SineWave from "./SineWave";
import GalaxyCore from "../../../../public/assets/GalaxyCore.jpg";

const maxAmp = 60;
const maxTries = 3;
const ampThreshold = maxAmp*0.5;
const phaseThreshold = 0.15;
const minFreq = 0.5;
const maxFreq = 1.5;

export default function Page() {
  const containerStyle = {
    ["--bg-image"]: `url(${GalaxyCore})`,
  };

  const targetRef = useRef(null);
  const playerRef = useRef(null);
  const [synced, setSynced] = useState(false);
  const [status, setStatus] = useState("Tap the Upper wave to sync.");
  const [triesLeft, setTriesLeft] = useState(maxTries);
  const [glitch, setGlitch] = useState(false);
  const [targetFreq, setTargetFreq] = useState(1.25);
  const [playerFreq, setPlayerFreq] = useState(0.75);
  const [hudText, sethudText] = useState("##########");
  const [popup, setPopup] = useState({
    visible: false,
    success: false,
    heading: "",
    message: null,
    buttonText: "",
    onClick: () => {},
  });


  function showResultPopup(success, message) {
    setPopup({
      visible: true,
      success,
      heading: success ? "Success!" : "Security Bypass Failed",
      message:
        message ??
        (success ? (
          <p>Waves synced.</p>
        ) : (
          <>
            <p>Temporal Cloak charge depleted...</p>
            <p>Life Support Systems powering down...</p>
          </>
        )),
      buttonText: "Acknowledge",
      onClick: () => setPopup((prev) => ({ ...prev, visible: false })),
    });
  }

  useEffect(() => {
    const len = 10
    const s = ""

    // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const chars = "0123456789"
    const intervalId = window.setInterval(() => {
      let out = "";
      for (let i = 0; i < len; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
      const mid = Math.floor(out.length / 2);
      out = out.slice(0, mid) + s + out.slice(mid);
      sethudText(out);
    }, 150);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setPopup({
      visible: true,
      success: true,
      heading: "C1: Agent 3000",
      message: <p>discription</p>,
      buttonText: "Acknowledge",
      onClick: () => setPopup((prev) => ({ ...prev, visible: false })),
    });
  }, []);

  function resetGame() {
    setSynced(false);
    setStatus("Tap the Upper wave to sync.");
    setTriesLeft(maxTries);
    setGlitch(false);
    setTargetFreq(1.25);
    setPlayerFreq(0.75);
  }

  function randomFreq() {
    return minFreq + Math.random() * (maxFreq - minFreq);
  }

  function randomFreqNotEqual(other) {
    let value = randomFreq();
    if (Math.abs(value - other) < 0.25) {
      value = randomFreq();
    }
    return value;
  }

  function phaseDelta(a, b) {
    const twoPi = Math.PI * 2;
    let d = Math.abs(a - b) % twoPi;
    if (d > Math.PI) d = twoPi - d;
    return d;
  }

  function handlePlayerTap() {
    if (synced || triesLeft <= 0) return;

    const target = targetRef.current?.getState();
    const player = playerRef.current?.getState();
    if (!target || !player) return;

    const ampDelta = Math.abs(target.amplitude - player.amplitude);
    const phaseDiff = phaseDelta(target.phase, player.phase);
    const ok = ampDelta <= ampThreshold && phaseDiff <= phaseThreshold;

    if (ok) {
      showResultPopup(true);
      setSynced(true);
      setStatus("Synced! Wave frozen.");
    } else {
      const nextTries = triesLeft - 1;
      setTriesLeft(nextTries);
      setStatus(
        `Keep trying. amp Δ=${ampDelta.toFixed(1)} phase Δ=${phaseDiff.toFixed(2)}`
      );
      if (nextTries > 0) {
        setGlitch(true);
        window.setTimeout(() => setGlitch(false), 450);
        const nextTarget = randomFreq();
        const nextPlayer = randomFreqNotEqual(nextTarget);
        setTargetFreq(nextTarget);
        setPlayerFreq(nextPlayer);
      }
      if (nextTries <= 0) {
        showResultPopup(false);
        setStatus("Out of tries. Resetting...");
        window.setTimeout(() => resetGame(), 800);
      }
    }
  }

  return (
    <div className="app-root" style={containerStyle}>
      {glitch && <div className="glitch-overlay" aria-hidden="true" />}
      <div className="hud">
        <div className="hud-row hud-row--top">
          <span className="hud-text">{hudText}</span>
          <span className="hud-text">TEMPERATURE: 0K</span>
        </div>
        <div className="hud-row hud-row--bottom">
          <span className="hud-text">Coordinates: [ERROR_NOT_FOUND]</span>
          <span className="hud-text">Data Link: [OVERRIDDEN]</span>
        </div>
      </div>
      {popup.visible && (
        <>
          <div className="scanlines-overlay" aria-hidden="true" />
          <div className="popup-overlay">
          <div
            className={`popup-box ${
              popup.success ? "popup-box--success" : "popup-box--failure"
            }`}
          >
            <div className="popup-title">{popup.heading}</div>
            <div className="popup-message">{popup.message}</div>
            <button
              className="popup-button"
              onClick={() => {
                if(synced) {
                  redirect('/level_0', RedirectType.replace);
                }
                else {
                  popup.onClick()
                }
              }}
            >
              {popup.buttonText}
            </button>
          </div>
        </div>
        </>
      )}
      
      <div className="wave-text">
        {status} {synced ? "" : `• Tries left: ${triesLeft}`}
      </div>
      <div className="wave-stack">
        <div className="wave-panel">
          <SineWave
            ref={targetRef}
            strokeColor="#2200ff"
            lineWidth={4}
            frequencyHz={synced ? 1 : targetFreq}
            decayRate={synced ? 0 : 0.95}
            className="sine-wave sine-wave--pulse"
            onTap={handlePlayerTap}
            maxAmplitude={maxAmp}
          />
        </div>
        <div className="wave-panel">
          <SineWave
            ref={playerRef}
            strokeColor={"#ff0008"}
            lineWidth={4}
            frequencyHz={synced ? 1 : playerFreq}
            className="sine-wave sine-wave--glow"
            interactive={!synced}
            decayRate={synced ? 0 : 0}
            maxAmplitude={maxAmp}
          />
        </div>
      </div>
    </div>
  );
}
