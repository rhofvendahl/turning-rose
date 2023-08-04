import React, { useEffect, useRef, useState } from "react";

import { Frame } from "../hooks/useFrame";
import PositionSlider from "./PositionSlider";
import SpeedSlider from "./SpeedSlider";
import SpeedModeButton from "./SpeedModeButton";
import { SPEED_CONSTANTS, ControlType, LOADED_THRESHOLD, getNLoaded } from "../shared/controlsStuff";

import "./LoadingBanner.css";

const LoadingBanner = ({ frames }: {
  frames: Frame[],
}) => {
  return (
    <div id="loading-banner">
      Loading rose...
    </div>
  );
};

export default LoadingBanner;