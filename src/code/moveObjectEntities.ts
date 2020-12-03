import { ObjectEntity, AppState, SetStateHandler, Direction } from '../App';

export const moveObjectEntities = (objs: ObjectEntity[], gameTicks: number, changeDirectionThreshold: number) => {
    objs.forEach(m => {
        if (gameTicks % m.speed === 0) {
            const shouldChangeDirection = Math.random() * 1000;
            if (shouldChangeDirection > changeDirectionThreshold) {
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

            // now change direction if obj hits wall
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
}