import React, { useEffect, useState } from "react";

import { Frame } from "../hooks/useFrames";
import { ControlType } from "../shared";

import "./Slider.css";

const PositionSlider = ({ currentFrame, setCurrentFrame, frames, setControlType }: {
  currentFrame: Frame | null,
  setCurrentFrame: (frame: Frame) => void,
  frames: Frame[],
  setControlType: (controlType: ControlType) => void,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  useEffect(() => {
    if (currentFrame !== null && frames.length > 1) {
      setSliderValue(currentFrame.index);
    }
  }, [currentFrame]);

  return (
    <input id="position-slider"
      type="range"
        min="0"
        max={frames.length - 1}
        step=".01"
      value={sliderValue}
      onChange={(event) => {
        if (frames.length > 1) {
          const value = parseFloat(event.target.value);
          const newFrameIndex = Math.floor(value);
          setCurrentFrame(frames[newFrameIndex]);
          setControlType("manual");
        }
      }}
    />
  );
};

export default PositionSlider;
