import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SineWaveCanvas = forwardRef(function SineWaveCanvas(
  {
    height = 200,
    strokeColor = "#b86cff",
    lineWidth = 1,
    className,

    spatialFrequency = 0.03,
    frequencyHz = 0.5,

    maxAmplitude = 60,
    minAmplitude = 7.5,
    decayRate = 0.95,
    tapImpulse = maxAmplitude/2,

    interactive = true,
    onTap,
  },
  ref
) {
  const canvasRef = useRef(null);

  // Internal oscillator state (never re-renders)
  const phase = useRef(0);
  const amplitude = useRef(maxAmplitude);

  useImperativeHandle(
    ref,
    () => ({
      getState: () => ({ phase: phase.current, amplitude: amplitude.current }),
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "16px ShareTechMono";
    let rafId = 0;
    let last = performance.now();

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(now) {
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.clientWidth;
      const centerY = canvas.clientHeight / 2;

      amplitude.current *= Math.exp(-decayRate * dt);
      if (amplitude.current < minAmplitude){
        amplitude.current = minAmplitude;
      }

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;

      // Actual function to render
      for (let x = 0; x < width; x++) {
        const X = x / 50 + phase.current;
        const y =
          centerY +
          (Math.floor(Math.sin(X))*Math.sin(4*X)) *
          amplitude.current;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      phase.current += frequencyHz * Math.PI * 2 * dt;
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [
    spatialFrequency,
    frequencyHz,
    decayRate,
    strokeColor,
    lineWidth,
  ]);

  function handlePointerDown() {
    if (!interactive) return;

    amplitude.current = Math.min(
      amplitude.current + tapImpulse,
      maxAmplitude
    );
    onTap?.();
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className={className}
      style={{
        width: "100%",
        height: `${height}px`,
        display: "block",
        touchAction: interactive ? "manipulation" : "auto",
      }}
    />
  );
});

export default SineWaveCanvas;
