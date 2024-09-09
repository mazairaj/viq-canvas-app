# viq-canvas-app

Take Home Challenge for VibeIQ

This project is a simple drawing application built with React, inspired by Excalidraw. It allows users to draw on a canvas using a pen/highlighter tool and navigate the canvas with pan and zoom functionality.

## Features

- Pen/Highlighter tool
  - Adjustable color
  - Adjustable width
  - Adjustable opacity
- Canvas navigation

  - Pan using trackpad or mouse
  - Zoom in/out using trackpad gestures or mouse wheel

  2. Open your browser and visit `http://localhost:3000`

## How to Use

- Select the pen tool from floating toolbar on the upper left side to start drawing (Selected by default)
- Use the color picker to change the pen color
- Adjust the pen width and opacity using the provided controls on the top toolbar
- You can toggle between drawing shapes and freedrawing by using the buttons on the floating toolbar
- Pan the canvas by dragging with two fingers on a trackpad or by holding the mouse button and dragging
- Zoom in/out using pinch gestures on a trackpad or by using the mouse wheel while holding the Ctrl key
- \*Note: Buttons on the floating toolbar have not yet been configured to perform actions.

## Code Structure

The main component of this application is the `Canvas` component, which handles:

- Drawing functionality (freehand and shapes)
- Pan and zoom interactions
- State management for drawing elements

## Performance Considerations

- The application uses React hooks like `useCallback` and `useMemo` to optimize performance
- Drawing operations are optimized to work efficiently with pan and zoom transformations

## Limitations

- There is no eraser tool
- Existing drawings cannot be updated or deleted
- Currently not enabled for multiple users

## Future Improvements

- Implement text input functionality
- Add an eraser tool
- Allow editing and deleting of existing drawings
- Improve touch device support
- Allow for multiple user editing

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
