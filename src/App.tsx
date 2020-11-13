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
  collisionDetected: boolean;
  apples: BodyCoOrds[];
  timeSinceLastApple: number;
  newAppleInterval: number;
  currentMousePosition: BodyCoOrds | null;
  score: number;
  highScore: number;
  entities: Entity[];
  context: CanvasRenderingContext2D | null;
  gameTicks: number;
  difficultyLevel: number;
}

const initState = () => {
  return {
    snakeBody: [],
    snakeLength: 100,
    rain: [],
    newRainInterval: 50,
    timeSinceLastRain: 0,
    rainSpeed: 2,
    collisionDetected: false,
    apples: [],
    timeSinceLastApple: 0,
    newAppleInterval: 500,
    currentMousePosition: null,
    score: 0,
    highScore: 0,
    entities: [],
    context: null,
    gameTicks: 0,
    difficultyLevel: 5
  } as AppState;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = initState();
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
    const state = initState();
    state.highScore = this.state.highScore;
    state.entities = getEntities();
    this.setState(state, () => window.requestAnimationFrame(this.update));
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