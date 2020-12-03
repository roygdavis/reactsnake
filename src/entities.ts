import { AppState, Direction, Entity, SetStateHandler } from "./App";

export const getEntities = (): Entity[] => {
    return [
        {
            name: "SNAKE",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                const head = state.snakeHeadPosition;
                const newHead = { x: head.x, y: head.y, direction: head.direction, speed: head.speed, ticksAge: head.ticksAge };
                if (state.gameTicks % newHead.speed === 0) {
                    switch (head.direction) {
                        case Direction.Down:
                            newHead.y += 10;
                            break;
                        case Direction.Up:
                            newHead.y -= 10;
                            break;
                        case Direction.Left:
                            newHead.x -= 10;
                            break;
                        case Direction.Right:
                            newHead.x += 10;
                            break;
                        default:
                            break;
                    }
                    if (state.snakeBody.length === state.snakeLength) {
                        const body = state.snakeBody.slice(1);
                        body.push(newHead);
                        state.snakeBody = body;
                    } else {
                        state.snakeBody.push(newHead);
                    }
                    state.snakeHeadPosition = newHead;

                    // out of bounds
                    if (newHead.x < 10 || newHead.x > window.innerWidth || newHead.y < 10 || newHead.y > window.innerHeight) state.collisionDetected = true;

                    // body into itself detection
                    state.snakeBody.forEach((r, i) => {
                        if (state.gameTicks > 100 && state.snakeBody.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
                            state.collisionDetected = true;
                        }
                    });
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                if (context) {
                    state.snakeBody.forEach((x, i) => {
                        context.beginPath();
                        if (i > 0) {
                            //context.arc(state.snakeBody[i].x, state.snakeBody[i].y, 10, 0, 2 * Math.PI);
                            context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                            context.fillStyle = "green";
                            context.fill();
                        }
                        context.closePath();
                    });
                }
            }
        },
        {
            name: "BIRDS/ENEMIES",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                state.timeSinceLastBird--;

                // get rid of mice which have fallen out of the bottom
                const { birds } = state; //.birds.filter(x => x.y < window.innerHeight);

                // make birds move 
                state.birds.forEach(m => {
                    if (state.gameTicks % m.speed === 0) {
                        const shouldChangeDirection = Math.random() * 1000;
                        if (shouldChangeDirection > 950) {
                            // change direction
                            const dir = Math.round(Math.random() * 3);
                            m.direction = dir as Direction;
                        }

                        switch (m.direction) {
                            case Direction.Down:
                                m.y += 10;
                                break;
                            case Direction.Up:
                                m.y -= 10;
                                break;
                            case Direction.Left:
                                m.x -= 10;
                                break;
                            case Direction.Right:
                                m.x += 10;
                                break;
                            default:
                                break;
                        }

                        // now change direction if mouse hits wall
                        if (m.x > window.innerWidth) {
                            m.x -= 10;
                            m.direction = Direction.Left;
                        }
                        if (m.x < 10) {
                            m.x = 10;
                            m.direction = Direction.Right;
                        }
                        if (m.y > window.innerHeight) {
                            m.y -= 10;
                            m.direction = Direction.Up;
                        }
                        if (m.y < 10) {
                            m.y -= 10;
                            m.direction = Direction.Down;
                        }
                    }

                });



                // increase score
                state.score = state.score + (state.birds.filter(x => x.y > window.innerHeight).length * 100);

                // create a new bird
                if (state.timeSinceLastBird < 0) {
                    const rx = Math.round(Math.random() * window.innerWidth);
                    const ry = Math.round(Math.random() * window.innerHeight);
                    const dx = Math.round(Math.random() * 3);
                    birds.push({ x: rx, y: ry, direction: dx as Direction, speed: state.birdSpeed, ticksAge: 0 });
                    state.timeSinceLastBird = state.newBirdsInterval;
                }

                // Collission detection
                birds.forEach(r => {
                    if (state.snakeBody.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
                        state.collisionDetected = true;
                    }
                });
                //state.birds = birds;
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.birds.forEach(x => {
                    context.beginPath();
                    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                    context.fillStyle = "red";
                    context.fill();
                    context.closePath();
                });
            }
        },
        {
            name: "MICE/FOOD",
            updateMethod: (state: AppState, setState: SetStateHandler): AppState => {
                // APPLES
                //const newApples = [];
                state.timeSinceLastMice--;
                if (state.timeSinceLastMice < 0) {
                    const ax = Math.round(Math.random() * window.innerWidth);
                    const ay = Math.round(Math.random() * window.innerHeight);
                    const dir = Math.round(Math.random() * 3);
                    state.mice.push({ x: ax, y: ay, direction: dir as Direction, speed: 20, ticksAge: 0 });
                    state.timeSinceLastMice = state.newMiceInterval;
                }
                if (state.snakeHeadPosition) {
                    const eatenApples = state.mice.filter(s => (state.snakeHeadPosition!.x - 10 < s.x && state.snakeHeadPosition!.x + 10 > s.x) && (state.snakeHeadPosition!.y - 10 < s.y && state.snakeHeadPosition!.y + 10 > s.y));
                    if (eatenApples.length > 0) {
                        state.score += 1000;
                        state.snakeLength = state.snakeLength + 10;
                        const newApples = state.mice.filter(x => !eatenApples.some(y => x.x === y.x && x.y === y.y));
                        state.mice = newApples;
                    }
                }

                // make mice move
                state.mice.forEach(m => {
                    if (state.gameTicks % m.speed === 0) {
                        const shouldChangeDirection = Math.random() * 1000;
                        if (shouldChangeDirection > 950) {
                            // change direction
                            const dir = Math.round(Math.random() * 3);
                            m.direction = dir as Direction;
                        }

                        switch (m.direction) {
                            case Direction.Down:
                                m.y += 10;
                                break;
                            case Direction.Up:
                                m.y -= 10;
                                break;
                            case Direction.Left:
                                m.x -= 10;
                                break;
                            case Direction.Right:
                                m.x += 10;
                                break;
                            default:
                                break;
                        }

                        // now change direction if mouse hits wall
                        if (m.x > window.innerWidth) {
                            m.x -= 10;
                            m.direction = Direction.Left;
                        }
                        if (m.x < 10) {
                            m.x = 10;
                            m.direction = Direction.Right;
                        }
                        if (m.y > window.innerHeight) {
                            m.y -= 10;
                            m.direction = Direction.Up;
                        }
                        if (m.y < 10) {
                            m.y -= 10;
                            m.direction = Direction.Down;
                        }
                    }

                });
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.mice.forEach(x => {
                    context.beginPath();
                    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                    context.fillStyle = "yellow";
                    context.fill();
                    context.closePath();
                });
            }
        },
        {
            name: "SCORE",
            updateMethod: (state: AppState, setState: SetStateHandler): AppState => {
                if (!state.collisionDetected) {
                    state.score++;                    
                }
                else {
                    if (state.score > state.highScore) state.highScore = state.score;
                }
                return state
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                context.font = "30px Comic Sans MS";
                context.fillStyle = "red";
                context.textAlign = "center";
                context.fillText(`Score: ${state.score}   High Score: ${state.highScore}`, 850, 50);
            }
        },
        {
            name: "PLAY AGAIN",
            updateMethod: (state: AppState, setState: SetStateHandler): AppState => state,
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                if (state.collisionDetected) {
                    context.font = "30px Comic Sans MS";
                    context.fillStyle = "red";
                    context.textAlign = "center";
                    context.fillText(`CLICK TO PLAY AGAIN`, 850, 500);
                }
            }
        },
        {
            name: "GAME TICKS",
            updateMethod: (state: AppState): AppState => {
                state.gameTicks++;
                if (state.gameTicks % 250 === 1) {
                    state.newBirdsInterval = state.newBirdsInterval - state.difficultyLevel;
                    state.newMiceInterval = state.newMiceInterval - state.difficultyLevel;
                    state.birdSpeed++;
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => { }
        }
    ]
}