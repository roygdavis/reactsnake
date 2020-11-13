import * as React from 'react';
import { AppState, BodyCoOrds, SetStateHandler } from '../App';

export interface CanvasProps {
    state: AppState;
    setState: SetStateHandler;
}
export const Canvas = ({ state, setState }: CanvasProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    React.useEffect(() => {
        const context = canvasRef.current && canvasRef.current.getContext("2d");
        if (context) {
            // do our draw here, incoming from props
            context.fillStyle = "white";
            context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            //context.beginPath();
            state.snakeBody.forEach(x => {
                context.beginPath();
                context.arc(x.x, x.y, 1, 0, 2 * Math.PI);
                context.fillStyle = "green";
                context.fill();
                context.closePath();
            });
            state.rain.forEach(x => {
                context.beginPath();
                context.arc(x.x, x.y, 1, 0, 2 * Math.PI);
                context.fillStyle = "red";
                context.fill();
                context.closePath();
            })
            //context.closePath();
        }
    });

    return (<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} onMouseMove={(e) => mouseMoveHandler(e.clientX, e.clientY, state, setState, canvasRef)}></canvas>)
}

const mouseMoveHandler = (x: number, y: number, state: AppState, setState: SetStateHandler, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const xpos = Math.round((x - rect.left) * scaleX);
        const ypos = Math.round((y - rect.top) * scaleY);
        const pos = { x: xpos, y: ypos } as BodyCoOrds;
        if (state.snakeBody.length === state.snakeLength) {
            const body = state.snakeBody.slice(1);
            body.push(pos);
            state.snakeBody = body;
        } else
            state.snakeBody.push(pos);
        setState(state);
    }
}