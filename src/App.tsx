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
      rainSpeed: 1000 / 60,
      totalTicks: 0,
      ticksDifference: 0,
      refreshRate: 1000 / 60,
      collisionDetected: false,
      animationFrameId: null
    };
  }

  update = () => {
    let { timeSinceLastRain, totalTicks, ticksDifference, refreshRate, collisionDetected } = this.state;
    const { rain, newRainInterval, snakeBody } = this.state;

    ticksDifference = (totalTicks + refreshRate) - totalTicks;
    totalTicks += refreshRate;
    timeSinceLastRain--;

    if (rain.length > 0) rain.forEach(x => x.y++);

    const newRain = rain.filter(x => x.y < 200);

    if (timeSinceLastRain < 0) {
      const rx = Math.round(Math.random() * 300);
      newRain.push({ x: rx, y: 0 });
      timeSinceLastRain = newRainInterval;
    }

    rain.forEach(r => {
      if (snakeBody.some(s => s.x === r.x && s.y === r.y)) {
        collisionDetected = true;
        console.log("Collision");
      }
    });

    let frameId = null;
    if (!collisionDetected) {
      frameId = window.requestAnimationFrame(this.update);
    }
    this.setState({ rain: newRain, timeSinceLastRain, animationFrameId: frameId });
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
      <Canvas state={this.state} setState={this.setStateWrapper}></Canvas>
    </div>);
  }
}
 
export default App;
export type SetStateHandler = (state: AppState) => void;