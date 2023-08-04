import React from "react";

import { Frame } from "../hooks/useFrames";
import { getLoadedRatio } from "../util";

import "./LoadingBanner.css";

const getPercent = (frames: Frame[]) => {
  const loadedRatio = getLoadedRatio(frames);
  return loadedRatio > 1 ? "100%" : `${loadedRatio * 100}%`;
}

const LoadingBanner = ({ frames }: {
  frames: Frame[],
}) => {
  return (
    <div id="loading-banner">
      <div id="loading-track"></div>
      <div id="loading-progress" style={{ width: getPercent(frames) }} />
      <div id="loading-text">Loading rose...</div>
    </div>
  );
};

export default LoadingBanner;