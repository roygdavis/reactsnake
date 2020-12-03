import React from 'react';
import { Canvas } from "./Components/Canvas";
import './App.css';
import { getEntities } from './entities';

export interface AppProps {

}

export type ObjectEntity = {
  x: number;
  y: number;
  direction: Direction;
  speed: number;
  ticksAge: number;
}

export type Entity = {
  name: string;
  updateMethod: (state: AppState, setState: SetStateHandler) => AppState;
  renderMethod: (state: AppState, context: CanvasRenderingContext2D) => void;
}

export enum Direction {
  Left,
  Right,
  Down,
  Up,
  Stationary
}

export interface AppState {
  shipBody: ObjectEntity[];
  shipLength: number;
  enemyShips: ObjectEntity[];
  newEnemyShipsInterval: number;
  timeSinceLastEnemyShip: number;
  enemyShipSpeed: number;
  collisionDetected: boolean;
  // mice: ObjectEntity[];
  // timeSinceLastMice: number;
  // newMiceInterval: number;
  shipHeadPosition: ObjectEntity;
  score: number;
  highScore: number;
  entities: Entity[];
  context: CanvasRenderingContext2D | null;
  gameTicks: number;
  difficultyLevel: number;
  lastKeyCode: string;
  shipLaser: ObjectEntity[];
}

const initState = () => {
  return {
    shipBody: [],
    shipLength: 5,
    enemyShips: [],
    newEnemyShipsInterval: 50,
    timeSinceLastEnemyShip: 0,
    enemyShipSpeed: 20,
    collisionDetected: false,
    // mice: [],
    // timeSinceLastMice: 0,
    // newMiceInterval: 500,
    shipHeadPosition: { x: 200, y: 500, direction: Direction.Right, speed: 5, ticksAge: 0 },
    score: 0,
    highScore: 0,
    entities: [],
    context: null,
    gameTicks: 0,
    difficultyLevel: 5,
    lastKeyCode: "",
    shipLaser: []
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
    window.onkeydown = this.handleKeyDown;
    window.requestAnimationFrame(this.update);
    this.setState({ entities: getEntities() });
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && this.state.collisionDetected) this.resetState();
    else this.setState({ lastKeyCode: e.code });
  }

  render() {
    return (<div className="App">
      <Canvas state={this.state} setState={this.setStateWrapper} render={canvasRender}></Canvas>
    </div>);
  }
}

const canvasRender = (state: AppState, context: CanvasRenderingContext2D) => {
  state.entities.forEach(x => x.renderMethod(state, context));
}

export default App;
export type SetStateHandler = (state: AppState) => void;