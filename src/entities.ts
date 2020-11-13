import { AppState, Entity, SetStateHandler } from "./App";

export const getEntities = (): Entity[] => {
    return [
        {
            name: "SNAKE",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                if (state.currentMousePosition) {
                    if (state.snakeBody.length === state.snakeLength) {
                        const body = state.snakeBody.slice(1);
                        body.push(state.currentMousePosition);
                        state.snakeBody = body;
                    } else
                        state.snakeBody.push(state.currentMousePosition);
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                if (context) {
                    state.snakeBody.forEach(x => {
                        context.beginPath();
                        context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                        context.fillStyle = "green";
                        context.fill();
                        context.closePath();
                    });
                }
            }
        },
        {
            name: "ACID RAIN",
            updateMethod: (state: AppState, setState: SetStateHandler) => {
                state.timeSinceLastRain--;
                if (state.rain.length > 0) state.rain.forEach(x => x.y = x.y + state.rainSpeed);
                const newRain = state.rain.filter(x => x.y < window.innerHeight);
                if (state.timeSinceLastRain < 0) {
                    const rx = Math.round(Math.random() * window.innerWidth);
                    newRain.push({ x: rx, y: 0 });
                    state.timeSinceLastRain = state.newRainInterval;
                }
                newRain.forEach(r => {
                    if (state.snakeBody.some(s => (r.x - 10 < s.x && r.x + 10 > s.x) && (r.y - 10 < s.y && r.y + 10 > s.y))) {
                        state.collisionDetected = true;
                        console.log("Collision");
                    }
                });
                state.rain = newRain;
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.rain.forEach(x => {
                    context.beginPath();
                    context.arc(x.x, x.y, 10, 0, 2 * Math.PI);
                    context.fillStyle = "red";
                    context.fill();
                    context.closePath();
                });
            }
        },
        {
            name: "APPLES",
            updateMethod: (state: AppState, setState: SetStateHandler): AppState => {
                // APPLES
                //const newApples = [];
                state.timeSinceLastApple--;
                if (state.timeSinceLastApple < 0) {
                    const ax = Math.round(Math.random() * window.innerWidth);
                    const ay = Math.round(Math.random() * window.innerHeight);
                    state.apples.push({ x: ax, y: ay });
                    state.timeSinceLastApple = state.newAppleInterval;
                }
                if (state.currentMousePosition) {
                    const eatenApples = state.apples.filter(s => (state.currentMousePosition!.x - 10 < s.x && state.currentMousePosition!.x + 10 > s.x) && (state.currentMousePosition!.y - 10 < s.y && state.currentMousePosition!.y + 10 > s.y));
                    if (eatenApples.length > 0) {
                        state.score += 1000;
                        state.snakeLength = state.snakeLength + 10;
                        console.log(state.apples.length);
                        const newApples = state.apples.filter(x => !eatenApples.some(y => x.x === y.x && x.y === y.y));
                        state.apples = newApples;
                    }
                }
                return state;
            },
            renderMethod: (state: AppState, context: CanvasRenderingContext2D) => {
                state.apples.forEach(x => {
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
                state.score++;
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
                    context.fillText(`CLICK HERE TO PLAY AGAIN`, 850, 500);
                }
            }
        }
    ]
}