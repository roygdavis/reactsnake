import React from 'react';
import { Canvas } from "./Components/Canvas";
import './App.css';
import { randomInt } from 'crypto';

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
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      snakeBody: [],
      snakeLength: 100,
      rain: [],
      newRainInterval: 500,
      timeSinceLastRain: 0
    };
  }

  update = () => {
    let { timeSinceLastRain } = this.state;
    const { rain } = this.state;

    timeSinceLastRain--;

    if (rain.length > 0) rain.forEach(x => x.y++);

    const newRain = rain.filter(x => x.y < 1000);

    if (timeSinceLastRain < 0) {
      const rx = Math.round(Math.random() * 100);
      rain.push({ x: rx, y: 0 });
      timeSinceLastRain = 500;
    }

    this.setState({ rain: newRain, timeSinceLastRain });
  }

  draw = () => {
    //this.state.snakeBody.forEach(x => console.log(x.x, x.y));
  }

  setStateWrapper = (state: AppState) => {
    this.setState(state);
  }

  componentDidMount() {
    setInterval(() => {
      this.update();
      //this.draw();
    }, 1000 / 60)
  }
  render() {
    return (<div className="App">
      <Canvas state={this.state} setState={this.setStateWrapper}></Canvas>
    </div>);
  }
}
 
export default App;
export type SetStateHandler = (state: AppState) => void;