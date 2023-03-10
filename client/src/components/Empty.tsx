import Preact from 'preact'
import { StateUpdater, memo } from "preact/compat"

import { empty } from './Table';

type props = {
    move : () => void,
    any_selected : () => boolean,
    clean_up : () => void,
    share_game : () => void,
    x_idx : number,
    y_idx : number,
    item : {
        type : string,
        selected : boolean,
        canMove : boolean,
        color : "white" | "black" | ""
    },
    turn : "white" | "black",
    color : "white" | "black"
}

const Empty : Preact.FunctionComponent<props> = ({
    item,
    x_idx,
    y_idx,
    any_selected,
    clean_up,
    move,
    share_game,
    turn,
    color
}) => {
  return (
    <div
    onClick={() => {
        if(turn !== color) return

        if(item.canMove && any_selected()){
            move()
            clean_up()
            share_game()
            return
        }
        clean_up()
    }}
    className={`
    cursor-pointer
    flex
    items-center
    justify-center
    w-[50px]
    h-[50px]
    ${item.canMove ? "border-green-500 border-2" : ""}
    ${item.selected ? "border-yellow-500 border-2" : ""}
    ${(x_idx + y_idx) % 2 === 0 ? "bg-violet-500" : "bg-violet-200"}
    `}>

    </div>
  )
}

export default memo(Empty)