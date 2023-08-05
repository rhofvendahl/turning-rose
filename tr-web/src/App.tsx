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

const radToDog = (rad: number): number => {
  return rad * 360 / (2 * Math.PI);
};

const degToRad = (deg: number): number => {
  return deg * 2 * Math.PI / 360;
};

// Yes I am aware that using loading ratio to drive rotation is silly. There are other ways to do it. This is easy.
// UPDATE: And here I was wonderwing why it moves so slowly on first load...
const getRotation = (frames: Frame[], start: number): [number, number, number] => {
  const delta = (Date.now() - start) / 1000;
  console.log("DELTA", delta)
  const loadedRatio = getLoadedRatio(frames);
  if (loadedRatio >= 1) {
    return [0, 0, 0];
  }
  return [0, degToRad(delta * 4), 0];
};

const App = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
  const currentFrameRef = useRef(currentFrame);
  const rotationIntervalRef = useRef(0);
  const startRef = useRef(Date.now())

  // Provide a way to access current frame within frame loading functions, so that the appropriate frame is loaded next
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // useEffect necessary for React to notice currentFrame update
  useEffect(() => {
    if (!hasInitialized) {
      useFrames({ setFrames, currentFrameRef, setCurrentFrame });

      // Put initial rotation in motion
      rotationIntervalRef.current = window.setInterval(() => {

      }, 1);
      hasInitialized = true;
    }
  }, []);

  return (
    <div id="content-container">
      <Canvas id="canvas">
        <ambientLight intensity={1} />
        <OrbitControls />
        <mesh rotation={getRotation(frames, startRef.current)} position={[0, .3, 0]}>
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