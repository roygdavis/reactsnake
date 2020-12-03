import * as React from 'react';
import { AppState, SetStateHandler } from '../App';

export interface CanvasProps {
    state: AppState;
    setState: SetStateHandler;
    render: (state: AppState, context: CanvasRenderingContext2D) => void;
}
export const Canvas = ({ state, setState, render }: CanvasProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    React.useEffect(() => {
        const context = canvasRef && canvasRef.current && canvasRef.current.getContext("2d");
        if (canvasRef.current && context) {
            updateCanvasSize(canvasRef.current, context);
            context.fillStyle = "white";
            context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            render(state, context);
        }
    });

    return (<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} ></canvas>)
}

// const mouseMoveHandler = (x: number, y: number, state: AppState, setState: SetStateHandler, canvasRef: React.RefObject<HTMLCanvasElement>) => {
//     state.snakeHeadPosition = { x: x, y: y } as BodyCoOrds;
//     setState(state);
// }

const updateCanvasSize = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.scale(ratio, ratio);
    }
};