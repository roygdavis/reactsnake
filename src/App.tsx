import React from 'react';
import { Canvas } from "./Components/Canvas";
import './App.css';

export interface AppProps {

}

export type BodyCoOrds = {
  x: number;
  y: number;
}

export interface AppState {
  snakeBody: BodyCoOrds[];
  snakeLength: number;
  rain: BodyCoOrds[];
  newRainInterval: number;
  timeSinceLastRain: number;
  rainSpeed: number;
  totalTicks: number;
  ticksDifference: number;
  refreshRate: number;
  collisionDetected: boolean;
  animationFrameId: number | null;
  frameWidth: number;
  frameHeight: number;
  apples: BodyCoOrds[];
  timeSinceLastApple: number;
  newAppleInterval: number;
  currentMousePosition: BodyCoOrds | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      snakeBody: [],
      snakeLength: 100,
      rain: [],
      newRainInterval: 50,
      timeSinceLastRain: 0,
      rainSpeed: 10,
      totalTicks: 0,
      ticksDifference: 0,
      refreshRate: 1000 / 60,
      collisionDetected: false,
      animationFrameId: null,
      frameWidth: 0,
      frameHeight: 0,
      apples: [],
      timeSinceLastApple: 0,
      newAppleInterval: 500,
      currentMousePosition: null
    };
  }

  update = () => {
    let { timeSinceLastRain, totalTicks, ticksDifference, refreshRate, apples, collisionDetected, timeSinceLastApple, snakeLength, snakeBody } = this.state;
    const { rain, newRainInterval, frameWidth, frameHeight, rainSpeed, newAppleInterval, currentMousePosition } = this.state;

    //ticksDifference = (totalTicks + refreshRate) - totalTicks;
    //totalTicks += refreshRate;

    // SNAKE
    if (currentMousePosition) {
      if (snakeBody.length === snakeLength) {
        const body = snakeBody.slice(1);
        body.push(currentMousePosition);
        snakeBody = body;
      } else
        snakeBody.push(currentMousePosition);
    }

    //ACID RAIN
    timeSinceLastRain--;
    if (rain.length > 0) rain.forEach(x => x.y = x.y + rainSpeed);
    const newRain = rain.filter(x => x.y < window.innerHeight);
    if (timeSinceLastRain < 0) {
      const rx = Math.round(Math.random() * window.innerWidth);
      newRain.push({ x: rx, y: 0 });
      timeSinceLastRain = newRainInterval;
    }
    rain.forEach(r => {
      if (snakeBody.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
        collisionDetected = true;
        console.log("Collision");
      }
    });

    // APPLES
    timeSinceLastApple--;
    if (timeSinceLastApple < 0) {
      const ax = Math.round(Math.random() * window.innerWidth);
      const ay = Math.round(Math.random() * window.innerHeight);
      apples.push({ x: ax, y: ay });
      timeSinceLastApple = newAppleInterval;
    }
    apples.forEach(r => {
      const eatenApples = snakeBody.filter(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y));
      if (eatenApples.length > 0) {
        snakeLength = snakeLength + 10;
        console.log(apples.length);
        apples = apples.filter(x => eatenApples.some(y => x.x === y.x && x.y === y.y));
      }
    });

    let frameId = null;
    if (!collisionDetected) {
      frameId = window.requestAnimationFrame(this.update);
    }
    this.setState({
      rain: newRain, timeSinceLastRain, animationFrameId: frameId, apples, timeSinceLastApple, collisionDetected, snakeLength, snakeBody
    });
  }

  draw = () => {
    //this.state.snakeBody.forEach(x => console.log(x.x, x.y));
  }

  setStateWrapper = (state: AppState) => {
    this.setState(state);
  }

  componentDidMount() {
    const frameId = window.requestAnimationFrame(this.update);
    this.setState({ animationFrameId: frameId });
  }
  render() {
    return (<div className="App">
      <Canvas state={this.state} setState={this.setStateWrapper} render={canvasRender}></Canvas>
    </div>);
  }
}

const canvasRender = (state: AppState, context: CanvasRenderingContext2D) => {
  //context.beginPath();
  state.snakeBody.forEach(x => {
    context.beginPath();
    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
    context.fillStyle = "green";
    context.fill();
    context.closePath();
  });
  state.rain.forEach(x => {
    context.beginPath();
    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  });
  state.apples.forEach(x => {
    context.beginPath();
    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
  });
  //context.closePath();
}

export default App;
export type SetStateHandler = (state: AppState) => void;