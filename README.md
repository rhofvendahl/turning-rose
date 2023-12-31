# Turning Rose
This project contains code relating to the Turning Rose project.

## tr_photogrammetry
```
cd tr_photogrammetry
```

### Build
```
xcodebuild -scheme tr_photogrammetry -derivedDataPath ./build
```

### Run
```
./build/Build/Products/Debug/tr_photogrammetry
```

## tr_scripts
### Requirements
- Install USDZ Tools ([here](https://developer.apple.com/augmented-reality/tools/)) \[or not actually]
- Add to .zshrc or equivalent: \[or not actually]
```
export USDPYTHON=/Applications/usdpython
export PATH=$PATH:$USDPYTHON/USD:$PATH:$USDPYTHON/usdzconvert
export PYTHONPATH=$HOME/.pyenv/versions/3.7.16/bin/python:$USDPYTHON/USD/lib/python
```
- Install pyassimp (unless pyassimp with pip works for you) \[or actually maybe not?]
  - https://github.com/assimp/assimp/blob/master/Build.md (build from source)
  - https://github.com/assimp/assimp/tree/master/port/PyAssimp (install)

## tr-web
```
cd tr-web
```

### Build
```
npm run build
```

### Rebuild on Changes
```
npm run build --watch
```

### Local Serve
```
npm run dev
```

### Deploy to Heroku
(This is a bit tricky as the webapp isn't root)
```
git subtree push --prefix tr-web heroku main
```