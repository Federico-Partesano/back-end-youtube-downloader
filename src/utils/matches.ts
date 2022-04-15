import { Match, SetMove } from "../models/match";

export const setMoves = ({startX, startY, finalX, finalY}: SetMove, matches: Match[], index: number, numberStart: number) => {
    const distanceX = finalX - startX;
    const distanceY = finalY - startY;
 
    if(Math.abs(distanceX) >= 2){
     
        matches[index].field[finalX -(distanceX === 2 ? 1 : -1)][finalY - (distanceY === 2 ? 1 : -1)] = 0;
    } 
}