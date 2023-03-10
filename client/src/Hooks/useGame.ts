import { useEffect, useState } from "preact/hooks"
import { opposite_colors } from "./useSharedGame"

type piece_type = "king" | "empty" | "queen" | "rook" | "knight" | "bishop" | "pawn"

type piece = {
    type : piece_type,
    canMove : boolean,
    color : "white" | "black",
    selected : boolean,
    firstTime : boolean
}

export const empty = {
    type : "empty",
    canMove : false,
    color : "",
    selected : false,
    firstTime : false
}

const piece = (
    type : piece_type,
    color : "white" | "black"
) => {
    return{
        type,
        canMove : false,
        color,
        selected : false,
        firstTime : type === "pawn",
    }
}

export const useGame = (
    color : "white" | "black",
    sharedGame : piece[][] | typeof empty[][],
    shareGame : (game : piece[][] | typeof empty[][]) => void
) => {
    const [game,setGame] = useState<piece[][] | typeof empty[][]>([[]])

    useEffect(() => {
        if(color === "white"){
        setGame([...sharedGame])
        return
        }
        setGame(sharedGame.map((_,p_idx,p_arr) => [...p_arr[(p_arr.length - p_idx) - 1].map((_,idx,arr) => arr[arr.length - idx - 1])]))

    },[sharedGame])

    const any_selected = () => {
        return game.some(i => i.some(v => v.selected))
    }

    const clean_up = () => {
        setGame(prev => {
            let clone = [...prev].map((i) => [...i.map((v) => { return {...v , selected : false , canMove : false}})]);
            return[...clone]
        })
    }

    const move = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            const clone = [...prev]
            const x =  clone.findIndex(i => i.some(v => v.selected === true))
            const y =  clone[x].findIndex(i => i.selected === true)
            clone[x_idx][y_idx] = {...clone[x][y], firstTime : false}
            clone[x][y] = empty
            return[...clone]
        })
    }

    const pawn_move_areas = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            let clone = [...prev]
            clone[x_idx][y_idx] = {...clone[x_idx][y_idx], selected : true}
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx]&& 
                clone[x_idx - 1][y_idx].type === "empty"
            ) clone[x_idx - 1][y_idx] = {...clone[x_idx - 1][y_idx], canMove : true}
            
            if(
                clone[x_idx - 2] && 
                clone[x_idx - 2][y_idx] && 
                clone[x_idx - 2][y_idx].type === "empty" && 
                clone[x_idx - 1][y_idx].type === "empty" &&
                clone[x_idx][y_idx].firstTime
            ) clone[x_idx - 2][y_idx] = {...clone[x_idx - 2][y_idx], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx - 1] && 
                ![color,""].includes(clone[x_idx - 1][y_idx - 1].color)
            ) clone[x_idx - 1][y_idx - 1] = {...clone[x_idx - 1][y_idx - 1], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx + 1] && 
                ![color,""].includes(clone[x_idx - 1][y_idx + 1].color)
            ) clone[x_idx - 1][y_idx + 1] = {...clone[x_idx - 1][y_idx + 1], canMove : true}
            
            return[...clone]
        })
    }

    const king_move_areas = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            let clone = [...prev]
            clone[x_idx][y_idx] = {...clone[x_idx][y_idx], selected : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx + 1]&& 
                clone[x_idx - 1][y_idx + 1].color !== color
            ) clone[x_idx - 1][y_idx + 1] = {...clone[x_idx - 1][y_idx + 1], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx]&& 
                clone[x_idx - 1][y_idx].color !== color
            ) clone[x_idx - 1][y_idx] = {...clone[x_idx - 1][y_idx], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx - 1]&& 
                clone[x_idx - 1][y_idx - 1].color !== color
            ) clone[x_idx - 1][y_idx - 1] = {...clone[x_idx - 1][y_idx - 1], canMove : true}
            
            if(
                clone[x_idx] && 
                clone[x_idx][y_idx - 1]&& 
                clone[x_idx][y_idx - 1].color !== color
            ) clone[x_idx][y_idx - 1] = {...clone[x_idx][y_idx - 1], canMove : true}
            
            if(
                clone[x_idx] && 
                clone[x_idx][y_idx + 1]&& 
                clone[x_idx][y_idx + 1].color !== color
            ) clone[x_idx][y_idx + 1] = {...clone[x_idx][y_idx + 1], canMove : true}

            if(
                clone[x_idx + 1] && 
                clone[x_idx + 1][y_idx + 1]&& 
                clone[x_idx + 1][y_idx + 1].color !== color
            ) clone[x_idx + 1][y_idx + 1] = {...clone[x_idx + 1][y_idx + 1], canMove : true}
            
            if(
                clone[x_idx + 1] && 
                clone[x_idx + 1][y_idx]&& 
                clone[x_idx + 1][y_idx].color !== color
            ) clone[x_idx + 1][y_idx] = {...clone[x_idx + 1][y_idx], canMove : true}
            
            if(
                clone[x_idx + 1] && 
                clone[x_idx + 1][y_idx - 1]&& 
                clone[x_idx + 1][y_idx - 1].color !== color
            ) clone[x_idx + 1][y_idx - 1] = {...clone[x_idx + 1][y_idx - 1], canMove : true}

            return[...clone]
        })
    }

    const rook_move_areas = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            let clone = [...prev];
            clone[x_idx][y_idx] = {...clone[x_idx][y_idx], selected : true}
            
            for( let i = 1;
                clone[x_idx + i] && 
                clone[x_idx + i][y_idx] && 
                clone[x_idx + i][y_idx].color !== color
                ;
                ++i
            ) {
                clone[x_idx + i][y_idx] = {...clone[x_idx + i][y_idx], canMove : true}
                if(clone[x_idx + i][y_idx].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx - i] && 
                clone[x_idx - i][y_idx]&& 
                clone[x_idx - i][y_idx].color !== color                ;
                ++i
            ) {
                clone[x_idx - i][y_idx] = {...clone[x_idx - i][y_idx], canMove : true}
                if(clone[x_idx - i][y_idx].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx] && 
                clone[x_idx][y_idx - i]&& 
                clone[x_idx][y_idx - i].color !== color                ;
                ++i
            ) {
                clone[x_idx][y_idx - i] = {...clone[x_idx][y_idx - i], canMove : true}
                if(clone[x_idx][y_idx - i].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx] && 
                clone[x_idx][y_idx + i]&& 
                clone[x_idx][y_idx + i].color !== color                ;
                ++i
            ) {
                clone[x_idx][y_idx + i] = {...clone[x_idx][y_idx + i], canMove : true}
                if(clone[x_idx][y_idx + i].color === opposite_colors[color]) break
            }

            return[...clone]
        })
    }

    const bishop_move_areas = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            let clone = [...prev]
            clone[x_idx][y_idx] = {...clone[x_idx][y_idx], selected : true}
            
            for( let i = 1;
                clone[x_idx + i] && 
                clone[x_idx + i][y_idx + i] && 
                clone[x_idx + i][y_idx + i].color !== color
                ;
                ++i
            ) {
                clone[x_idx + i][y_idx + i] = {...clone[x_idx + i][y_idx + i], canMove : true}
                if(clone[x_idx + i][y_idx + i].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx - i] && 
                clone[x_idx - i][y_idx - i]&& 
                clone[x_idx - i][y_idx - i].color !== color                ;
                ++i
            ) {
                clone[x_idx - i][y_idx - i] = {...clone[x_idx - i][y_idx - i], canMove : true}
                if(clone[x_idx - i][y_idx - i].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx + i] && 
                clone[x_idx + i][y_idx - i]&& 
                clone[x_idx + i][y_idx - i].color !== color                ;
                ++i
            ) {
                clone[x_idx + i][y_idx - i] = {...clone[x_idx + i][y_idx - i], canMove : true}
                if(clone[x_idx + i][y_idx - i].color === opposite_colors[color]) break
            }

            for( let i = 1;
                clone[x_idx - i] && 
                clone[x_idx - i][y_idx + i]&& 
                clone[x_idx - i][y_idx + i].color !== color                ;
                ++i
            ) {
                clone[x_idx - i][y_idx + i] = {...clone[x_idx - i][y_idx + i], canMove : true}
                if(clone[x_idx - i][y_idx + i].color === opposite_colors[color]) break
            }

            return[...clone]
        })
    }

    const knight_move_areas = (
        x_idx : number,
        y_idx : number
    ) => {
        setGame(prev => {
            let clone = [...prev]
            clone[x_idx][y_idx] = {...clone[x_idx][y_idx], selected : true}
            
            if(
                clone[x_idx - 2] && 
                clone[x_idx - 2][y_idx + 1]&& 
                clone[x_idx - 2][y_idx + 1].color !== color
            ) clone[x_idx - 2][y_idx + 1] = {...clone[x_idx - 2][y_idx + 1], canMove : true}
            
            if(
                clone[x_idx - 2] && 
                clone[x_idx - 2][y_idx - 1]&& 
                clone[x_idx - 2][y_idx - 1].color !== color
            ) clone[x_idx - 2][y_idx - 1] = {...clone[x_idx - 2][y_idx - 1], canMove : true}
            
            if(
                clone[x_idx + 2] && 
                clone[x_idx + 2][y_idx - 1]&& 
                clone[x_idx + 2][y_idx - 1].color !== color
            ) clone[x_idx + 2][y_idx - 1] = {...clone[x_idx + 2][y_idx - 1], canMove : true}
            
            if(
                clone[x_idx + 2] && 
                clone[x_idx + 2][y_idx + 1]&& 
                clone[x_idx + 2][y_idx + 1].color !== color
            ) clone[x_idx + 2][y_idx + 1] = {...clone[x_idx + 2][y_idx + 1], canMove : true}

            if(
                clone[x_idx + 1] && 
                clone[x_idx + 1][y_idx + 2]&& 
                clone[x_idx + 1][y_idx + 2].color !== color
            ) clone[x_idx + 1][y_idx + 2] = {...clone[x_idx + 1][y_idx + 2], canMove : true}
            
            if(
                clone[x_idx + 1] && 
                clone[x_idx + 1][y_idx - 2]&& 
                clone[x_idx + 1][y_idx - 2].color !== color
            ) clone[x_idx + 1][y_idx - 2] = {...clone[x_idx + 1][y_idx - 2], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx + 2]&& 
                clone[x_idx - 1][y_idx + 2].color !== color
            ) clone[x_idx - 1][y_idx + 2] = {...clone[x_idx - 1][y_idx + 2], canMove : true}
            
            if(
                clone[x_idx - 1] && 
                clone[x_idx - 1][y_idx - 2]&& 
                clone[x_idx - 1][y_idx - 2].color !== color
            ) clone[x_idx - 1][y_idx - 2] = {...clone[x_idx - 1][y_idx - 2], canMove : true}

            return[...clone]
        })
    }
    
    const share_game = () => {
        if(color === "white"){
            shareGame(game.map((i) => [...i.map((v) => { return {...v , selected : false , canMove : false}})]))
            return
        }
        shareGame(game.map(
            (_,p_idx,p_arr) => 
            [...p_arr[(p_arr.length - p_idx) - 1].map((_,idx,arr) => 
                arr[arr.length - idx - 1])]
                ).map((i) => [...i.map((v) => { return {...v , selected : false , canMove : false}})])
            )

    }


    return {
        game,
        functions : {
            any_selected,
            move,
            clean_up,
            pawn_move_areas,
            king_move_areas,
            rook_move_areas,
            bishop_move_areas,
            knight_move_areas,
            share_game
        }
    }

}