import { AppState, Direction, Entity, ObjectEntity, SetStateHandler } from "./App";
import { moveObjectEntities } from './code/moveObjectEntities';

export const getEntities = (): Entity[] => {
    return [
        {
            name: "SNAKE",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                if (state.gameTicks % state.shipHeadPosition.speed === 0) {
                    const head = state.shipHeadPosition;
                    const newHead = JSON.parse(JSON.stringify(head)) as ObjectEntity; //{ x: head.x, y: head.y, direction: head.direction, speed: head.speed, ticksAge: head.ticksAge };

                    switch (state.lastKeyCode) {
                        case "ArrowUp":
                            newHead.direction = Direction.Up;
                            break;
                        // case "ArrowLeft":
                        //     newHead.direction = Direction.Left;
                        //     break;
                        // case "ArrowRight":
                        //     newHead.direction = Direction.Right;
                        //     break;
                        case "ArrowDown":
                            newHead.direction = Direction.Down;
                            break;
                        default:
                            break;
                    }

                    switch (newHead.direction) {
                        case Direction.Down:
                            newHead.y += 10;
                            break;
                        case Direction.Up:
                            newHead.y -= 10;
                            break;
                        // case Direction.Left:
                        //     head.x -= 10;
                        //     break;
                        // case Direction.Right:
                        //     head.x += 10;
                        //     break;
                        default:
                            break;
                    }
                    // portal
                    // if (newHead.x > window.innerWidth) newHead.x = 20;
                    //if (newHead.x < 20) newHead.x = window.innerWidth - 10;
                    if (newHead.y > window.innerHeight) newHead.y = window.innerHeight - 20;
                    if (newHead.y < 20) newHead.y = 20;
                    
                    // body into itself detection
                    // if (state.snakeBody.some(s => (newHead.x - 10 < s.x && newHead.x + 10 > s.x) && (newHead.y - 10 < s.y && newHead.y + 10 > s.y))) {
                    //     state.collisionDetected = true;
                    // }


                    //push head to array
                    if (state.shipBody.length === state.shipLength) {
                        const body = state.shipBody.slice(1);
                        body.push(newHead);
                        state.shipBody = body;
                    } else {
                        state.shipBody.push(newHead);
                    }
                    state.shipHeadPosition = newHead;
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                if (context) {
                    state.shipBody.forEach((x, i) => {
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
            name: "SHIPS/ENEMIES",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                state.timeSinceLastEnemyShip--;

                const { enemyShips } = state; //.birds.filter(x => x.y < window.innerHeight);
                // get rid of mice which have fallen out of the bottom

                // make birds move 
                moveObjectEntities(enemyShips, state.gameTicks, false);

                // increase score
                state.score = state.score + (state.enemyShips.filter(x => x.y > window.innerHeight).length * 100);

                // create a new bird
                if (state.timeSinceLastEnemyShip < 0) {
                    const rx = window.innerWidth;//Math.round(Math.random() * window.innerWidth);
                    const ry = Math.round(Math.random() * window.innerHeight);
                    const dx = Direction.Left;// Math.round(Math.random() * 3);
                    enemyShips.push({ x: rx, y: ry, direction: dx as Direction, speed: state.enemyShipSpeed, ticksAge: 0 });
                    state.timeSinceLastEnemyShip = state.newEnemyShipsInterval;
                }

                // Collission detection
                enemyShips.forEach(r => {
                    if (state.shipBody.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
                        state.collisionDetected = true;
                    }
                });
                //state.birds = birds;
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.enemyShips.forEach(x => {
                    context.beginPath();
                    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                    context.fillStyle = "red";
                    context.fill();
                    context.closePath();
                });
            }
        },
        // {
        //     name: "MICE/FOOD",
        //     updateMethod: (state: AppState, setState: SetStateHandler): AppState => {
        //         // APPLES
        //         //const newApples = [];
        //         state.timeSinceLastMice--;
        //         if (state.timeSinceLastMice < 0) {
        //             const ax = Math.round(Math.random() * window.innerWidth);
        //             const ay = Math.round(Math.random() * window.innerHeight);
        //             const dir = Math.round(Math.random() * 3);
        //             state.mice.push({ x: ax, y: ay, direction: dir as Direction, speed: 20, ticksAge: 0 });
        //             state.timeSinceLastMice = state.newMiceInterval;
        //         }
        //         if (state.shipHeadPosition) {
        //             const eatenApples = state.mice.filter(s => (state.shipHeadPosition!.x - 10 < s.x && state.shipHeadPosition!.x + 10 > s.x) && (state.shipHeadPosition!.y - 10 < s.y && state.shipHeadPosition!.y + 10 > s.y));
        //             if (eatenApples.length > 0) {
        //                 state.score += 1000;
        //                 state.shipLength = state.shipLength + 10;
        //                 const newApples = state.mice.filter(x => !eatenApples.some(y => x.x === y.x && x.y === y.y));
        //                 state.mice = newApples;
        //             }
        //         }

        //         // make mice move
        //         moveObjectEntities(state.mice, state.gameTicks, true, 900);

        //         return state;
        //     },
        //     renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
        //         state.mice.forEach(x => {
        //             context.beginPath();
        //             context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
        //             context.fillStyle = "yellow";
        //             context.fill();
        //             context.closePath();
        //         });
        //     }
        // },
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
                    context.fillText(`PRESS [SPACE] TO PLAY AGAIN`, 850, 500);
                }
            }
        },
        {
            name: "GAME TICKS",
            updateMethod: (state: AppState): AppState => {
                state.gameTicks++;
                if (state.gameTicks % 250 === 1) {
                    state.newEnemyShipsInterval = state.newEnemyShipsInterval - state.difficultyLevel;
                    //state.newMiceInterval = state.newMiceInterval - state.difficultyLevel;
                    state.enemyShipSpeed++;
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => { }
        },
        {
            name: "LASERS",
            updateMethod: (state: AppState): AppState => {
                const { lastKeyCode, shipLaser, collisionDetected, shipHeadPosition } = state;
                if (!collisionDetected && lastKeyCode === "Space") {
                    state.lastKeyCode = "";
                    // create venom
                    shipLaser.push({
                        x: shipHeadPosition.x,
                        y: shipHeadPosition.y,
                        direction: Direction.Right,
                        speed: 1,
                        ticksAge: 0
                    });
                }
                // move venom 
                moveObjectEntities(shipLaser, state.gameTicks, false);
                const newLasers = shipLaser.filter(v => !(v.x > window.innerWidth - 20));

                // collission detection
                const newEnemyShips = [] as ObjectEntity[];
                state.enemyShips.forEach(r => {
                    if (!newLasers.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
                        newEnemyShips.push(r);
                    }
                });
                if (newEnemyShips.length !== state.enemyShips.length) {
                    state.enemyShips = newEnemyShips;
                }
                state.shipLaser = newLasers;
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.shipLaser.forEach(x => {
                    const width = (x.direction === Direction.Down || x.direction === Direction.Up) ? 3 : 10;
                    const height = (x.direction === Direction.Left || x.direction === Direction.Right) ? 3 : 10;
                    context.beginPath();
                    context.fillRect(x.x, x.y, width, height);
                    context.fillStyle = "blue";
                    context.fill();
                    context.closePath();
                });
            }

        }
    ]
}