import React from 'react';
import { Canvas } from "./Components/Canvas";
import './App.css';
import { getEntities } from './entities';

export interface AppProps {

}

export type BodyCoOrds = {
  x: number;
  y: number;
}

export type Entity = {
  name: string;
  updateMethod: (state: AppState, setState: SetStateHandler) => AppState;
  renderMethod: (state: AppState, context: CanvasRenderingContext2D) => void;
}

export interface AppState {
  snakeBody: BodyCoOrds[];
  snakeLength: number;
  rain: BodyCoOrds[];
  newRainInterval: number;
  timeSinceLastRain: number;
  rainSpeed: number;
  //totalTicks: number;
  //ticksDifference: number;
  //refreshRate: number;
  collisionDetected: boolean;
  //animationFrameId: number | null;
  //frameWidth: number;
  //frameHeight: number;
  apples: BodyCoOrds[];
  timeSinceLastApple: number;
  newAppleInterval: number;
  currentMousePosition: BodyCoOrds | null;
  score: number;
  highScore: number;
  entities: Entity[];
  context: CanvasRenderingContext2D | null;
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
      //totalTicks: 0,
      //ticksDifference: 0,
      //refreshRate: 1000 / 60,
      collisionDetected: false,
      //animationFrameId: null,
      //frameWidth: 0,
      //frameHeight: 0,
      apples: [],
      timeSinceLastApple: 0,
      newAppleInterval: 500,
      currentMousePosition: null,
      score: 0,
      highScore: 0,
      entities: [],
      context: null
    };
  }

  update = () => {
    const { entities } = this.state;
    
    let state = this.state;
    entities.forEach(x => {
      state = x.updateMethod(state, this.setStateWrapper);
    });
    this.setState(state);

    if (!this.state.collisionDetected) {
      window.requestAnimationFrame(this.update);
    }
  }

  setStateWrapper = (state: AppState) => {
    this.setState(state);
  }

  resetState = () => {
    this.setState({
      snakeBody: [],
      snakeLength: 100,
      rain: [],
      newRainInterval: 50,
      timeSinceLastRain: 0,
      rainSpeed: 10,
      collisionDetected: false,
      apples: [],
      timeSinceLastApple: 0,
      newAppleInterval: 500,
      currentMousePosition: null,
      score: 0,
      //entities: []
    }, () => window.requestAnimationFrame(this.update));
  }

  componentDidMount() {
    window.requestAnimationFrame(this.update);
    this.setState({ entities: getEntities() });
  }

  render() {
    return (<div className="App" onClick={() => {
      if (this.state.collisionDetected) this.resetState();
    }}>
      <Canvas state={this.state} setState={this.setStateWrapper} render={canvasRender}></Canvas>
    </div>);
  }
}

const canvasRender = (state: AppState, context: CanvasRenderingContext2D) => {
  state.entities.forEach(x => x.renderMethod(state, context));
}

export default App;
export type SetStateHandler = (state: AppState) => void;