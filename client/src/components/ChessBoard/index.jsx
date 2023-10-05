import React, { useState } from "react";
import Square from "../Square";
import chessicons from "../../config/chessicons";

const ChessBoard = () => {
    const [game, setGame] = useState([
      ["wr", "wkn", "wb", "wq", "wk", "wb", "wkn", "wr"],
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      ["br", "bkn", "bb", "bq", "bk", "bb", "bkn", "br"],
    ]);
    const board=[]
    for (let i = 0; i < 8; i++) {
      let s, e;
      let row=[];
      if (i%2)
      {
        s='#eeeed2';
        e='#769656';
      }
      else
      {
        e='#eeeed2';
        s='#769656';
      }
      for (let j = 0; j < 8; j++) {
        if (j%2)
        {
          row.push(<Square colour={s} icon={(game[i][j]==" ")? " " : chessicons[game[i][j]]}/>)
        }
        else
        {
          row.push(<Square colour={e} icon={(game[i][j]==" ")? " " : chessicons[game[i][j]]}/>)
        }
      }
      board.push(row);
    }
    return (
      <>
        {
          board.map((row) => {
            return <>
          <div className="flex flex-row">
            {row}
          </div>
          </>
          })
        }
      </>
    )
  };
  
  export default ChessBoard;
  