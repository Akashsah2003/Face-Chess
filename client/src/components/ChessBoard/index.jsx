import React, { useEffect, useState } from "react";
import Square from "../Square";
import chessicons from "../../config/chessicons";
import chesscolours from "../../config/chesscolours";

const ChessBoard = () => {
    const [game, setGame] = useState([[
      ["wr", "wkn", "wb", "wq", "wk", "wb", "wkn", "wr"],
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      ["br", "bkn", "bb", "bq", "bk", "bb", "bkn", "br"],
    ]]);
    const inbcolour = [
      ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
      ['b' ,'w', 'b', 'w', 'b', 'w', 'b', 'w'],
      ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
      ['b' ,'w', 'b', 'w', 'b', 'w', 'b', 'w'],
      ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
      ['b' ,'w', 'b', 'w', 'b', 'w', 'b', 'w'],
      ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
      ['b' ,'w', 'b', 'w', 'b', 'w', 'b', 'w']
    ];

    const [bcolour, setBcolour] = useState(inbcolour);
    const [turn, setTurn] = useState("w");
    const [moves, setMoves] = useState([]);
    const [movepiece, setMovepiece]=useState([]);
    const [tile, setTile] = useState("");

    const calcmove = (piece) => {
      const x = tile[0]-'0';
      const y = tile[1]-'0';
      if (piece.length==3)
      {
        const pmov = [[x+2, y-1], [x+2, y+1], [x-2, y-1], [x-2, y+1], [x+1, y+2], [x+1, y-2], [x-1, y+2], [x-1, y-2]];
        let nmov=[];
        for (let i = 0; i < pmov.length; i++) {
          if (pmov[i][0]>=0 && pmov[i][1]>=0 && pmov[i][0]<=7 && pmov[i][1]<=7 && (game[game.length-1][pmov[i][0]][pmov[i][1]]==" " || game[game.length-1][pmov[i][0]][pmov[i][1]][0]!=piece[0])) {
            nmov.push(pmov[i]);
          }
        }
        setMovepiece([x, y]);
        setMoves(nmov);
      }
      else if (piece[1]=="p") {
        let f=1;
        let incr=0;
        let nmov=[]
        if (turn=="w")
        {
          incr=1;
        }
        else
        {
          incr=-1;
        }
        if (x+incr<=7 && x+incr>=0)
        {
          if (y+incr<=7 && y+incr>=0)
          {
            if (game[game.length-1][x+incr][y+incr][0]!=piece[0] && game[game.length-1][x+incr][y+incr][0]!=" ")
            {
              nmov.push([x+incr, y+incr]);
              f=0;
            }
          }
          if (y-incr>=0 && y-incr<=7)
          {
            if (game[game.length-1][x+incr][y-incr][0]!=piece[0] && game[game.length-1][x+incr][y-incr][0]!=" ")
            {
              nmov.push([x+incr, y-incr]);
              f=0;
            }
          }
        }
        if(f)
        {
          if (x+incr<=7 && x+incr>=0 && game[game.length-1][x+incr][y]==" ")
          {

            nmov.push([x+incr, y]);
          }
          if (x==1 && turn=="w" && game[game.length-1][x+2*incr][y]==" ")
          {
            nmov.push([x+2*incr, y]);
          }
          else if (x==6 && turn=="b" && game[game.length-1][x+2*incr][y]==" ")
          {
            nmov.push([x+2*incr, y]);
          }
        }
        setMovepiece([x, y]);
        setMoves(nmov);
      }
    }

    useEffect( () =>{
      if (tile.length>0)
      {
        // console.log(tile);
        const ctile = game[game.length-1][tile[0]-'0'][tile[1]-'0'];
        console.log(ctile);
        if (bcolour[tile[0]-'0'][tile[1]-'0']=="d")
        {
          let cgame=game[game.length-1];
          cgame[tile[0]-'0'][tile[1]-['0']]=cgame[movepiece[0]][movepiece[1]];
          cgame[movepiece[0]][movepiece[1]]=" ";
          console.log(cgame);
          let gamehistory = game;
          gamehistory.push(cgame);
          setGame(gamehistory);
          setBcolour(inbcolour);
          if (turn == "w")
          {
            setTurn("b");
          }
          else
          {
            setTurn("w");
          }
        }
        if (ctile != " ")
        {
          if (turn == ctile[0])
          {
            calcmove(ctile);
            // console.log("y");
          }
        }
      }
    }, [tile]);

    useEffect( () => {
      console.log(moves);
      let cbcolour = inbcolour;
      for (let i = 0; i < moves.length; i++) {
        cbcolour[moves[i][0]][moves[i][1]] = 'd';
      }
      setBcolour(cbcolour);
    }, [moves])


    const board=[];
    for (let i = 0; i < 8; i++) {
      let s, e;
      let row=[];
      for (let j = 0; j < 8; j++) {
          row.push(<Square colour={chesscolours[bcolour[i][j]]} setTile={setTile} icon={(game[game.length-1][i][j]==" ")? " " : chessicons[game[game.length-1][i][j]]} keyy={i.toString()+j.toString()}/>)
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
  