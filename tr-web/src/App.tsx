import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./App.css";
import ViewFrame from "./components/ViewFrame";
import Controls from "./components/Controls";
import { useFrames, Frame } from "./hooks/useFrames";
import LoadingBanner from "./components/LoadingBanner";
import { getLoadedRatio } from "./shared"

// This doesn't seem ideal, but even useEffect with empty inputs within App seems to run twice over the app"s lifecycle - no good.
let hasInitialized = false;

const degToRad = (deg: number): number => {
  return deg * 2 * Math.PI / 360;
};

const getRotation = (start: number): [number, number, number] => {
  const delta = (Date.now() - start) / 1000;
  return [0, degToRad(delta * 4), 0];
};

const App = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
  const currentFrameRef = useRef(currentFrame);

  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const rotationIntervalRef = useRef(0);

  // Provide a way to access current frame within frame loading functions, so that the appropriate frame is loaded next
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // useEffect necessary for React to notice currentFrame update
  useEffect(() => {
    if (!hasInitialized) {
      useFrames({ setFrames, currentFrameRef, setCurrentFrame });

      // Put initial rotation in motion
      const start = Date.now()
      rotationIntervalRef.current = window.setInterval(() => {
        const rotation = getRotation(start);
        setRotation(rotation);
      }, 50);
      hasInitialized = true;
    }
  }, []);

  // Stop rotation once loaded
  useEffect(() => {
    const loadedRatio = getLoadedRatio(frames);
    if (loadedRatio >= 1) {
      window.clearInterval(rotationIntervalRef.current);
    }
  }, [frames]);

  return (
    <div id="content-container">
      <Canvas id="canvas">
        <ambientLight intensity={1} />
        <OrbitControls />
        <mesh rotation={rotation} position={[0, .3, 0]}>
          { currentFrame !== null && getLoadedRatio(frames) >= 1 ? <ViewFrame frame={currentFrame} /> : <ViewFrame frame={frames[frames.length - 1]} />}
        </mesh>
      </Canvas>
      {getLoadedRatio(frames) >= 1 ?
        <div id="controls-wrapper">
          <Controls frames={frames} currentFrame={currentFrame} setCurrentFrame={setCurrentFrame} />
        </div> :
        <div>
          <LoadingBanner frames={frames} />
        </div>
      }
    </div>
  );
};

export default App;