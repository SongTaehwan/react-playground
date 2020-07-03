import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const acc = 0.05;

function App() {
  const [delayedYOffset, setDelayedYOffset] = useState(0);
  const prevOffset = useRef(0);
  const rafId = useRef(0);
  const rafState = useRef(false);
  const app = useRef<HTMLDivElement>();

  const setRef = (node: HTMLDivElement) => {
    if (node) {
      app.current = node;
    }
  };

  const moveProgressBar = () => {
    const prevDelayedYOffset = prevOffset.current;
    const scrollableRange = app.current!.offsetHeight - window.innerHeight;
    const ratio = app.current!.offsetWidth / scrollableRange;
    const restDistance = window.pageYOffset * ratio - prevDelayedYOffset;

    prevOffset.current = prevDelayedYOffset + restDistance * acc;
    setDelayedYOffset(prevOffset.current);

    rafId.current = requestAnimationFrame(moveProgressBar);

    if (Math.abs(restDistance) < 1) {
      cancelAnimationFrame(rafId.current);
      rafState.current = false;
    }
  };

  const scrollCallback = () => {
    if (!rafState.current) {
      rafId.current = requestAnimationFrame(moveProgressBar);
      rafState.current = true;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollCallback);
    return () => {
      window.removeEventListener('scroll', scrollCallback);
    };
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(moveProgressBar);
    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="App" ref={setRef}>
      <div className="box" style={{ width: delayedYOffset }}></div>
    </div>
  );
}

export default App;
