import { Mesh } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import modelNames from "../assets/json/modelNames.json"

export interface Frame {
  index: number;
  name: string;
  model: GLTF | null;
}

export const MODEL_PATH_BASE = "https://storage.googleapis.com/turning_rose/gltf/";

const getNextIndex = (frames: Frame[], currentFrameIndex: Frame | null): number | null => {
  if (currentFrameIndex === null) {
    return 0;
  }

  // First load from the current frame onward; the current frame should already be loaded but no harm checking
  for (let i = currentFrameIndex.index; i < frames.length; i++) {
    if (frames[i].model === null) {
      return i;
    }
  }
  // If everything ahead is loaded, load any skipped frames
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].model === null) {
      return i;
    }
  }
  // All frames loaded
  console.log('All frames loaded:', frames);
  return null;
};

// Modifies model inplace
const configureModel = (model: GLTF) => {
  model.scene.traverse((child) => {
    // Harmless due to isMesh check, and necessary to quiet ts errors
    let mesh = child as Mesh;
    if (mesh.isMesh) {
      let material = mesh.material;
      if (!Array.isArray(material)) {
        material.transparent = true;
      }
    }
  })
}

const loadModels = async ({ frames, setFrames, currentFrameRef, setCurrentFrame }: {
  frames: Frame[],
  setFrames: (frames: Frame[]) => void,
  currentFrameRef: React.MutableRefObject<Frame | null>,
  setCurrentFrame: (frame: Frame) => void,
}) => {
  const loader = new GLTFLoader();

  let nextIndex = getNextIndex(frames, currentFrameRef.current);
  while (nextIndex !== null) {
    const loadingFrame = frames[nextIndex];
    const model = await loader.loadAsync(MODEL_PATH_BASE + loadingFrame.name);
    console.log("Loaded:", loadingFrame.index, loadingFrame.name);
    configureModel(model);
    loadingFrame.model = model;
    
    // This is 100% just to trigger frames state change elsewhere in app.
    // This does not change the frame objects, only the containing array.
    const newFramesArray: Frame[] = frames.map((frame: Frame) => frame);
    setFrames(newFramesArray);

    if (currentFrameRef.current === null) {
      setCurrentFrame(loadingFrame);
      currentFrameRef.current = loadingFrame;
    }
    // Update for subsequent checks
    nextIndex = getNextIndex(frames, currentFrameRef.current);
  }
};

// NOTE: This is pretty much guaranteed to run no more than once
export const useFrame = ({ setFrames, currentFrameRef, setCurrentFrame }: {
  setFrames: (frames: Frame[]) => void,
  currentFrameRef: React.MutableRefObject<Frame | null>,
  setCurrentFrame: (frame: Frame) => void, 
}) => {
  console.log('Loading frames...');
  const newFrames: Frame[] = modelNames.map((name, i) => {
    const frame: Frame = {
      index: i,
      name: name,
      model: null,
    };
    return frame;
  });
  setFrames(newFrames);
  // Passing in newFrames cause I'm not sure how long til frames gets updated from setFrames()
  loadModels({ frames: newFrames, setFrames, currentFrameRef, setCurrentFrame });
};