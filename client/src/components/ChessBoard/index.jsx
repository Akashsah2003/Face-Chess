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
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
    ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
    ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w']
  ];

  const [bcolour, setBcolour] = useState(inbcolour);
  const [turn, setTurn] = useState("w");
  const [moves, setMoves] = useState([]);
  const [check, setCheck] = useState(false);
  const [winner, setWinner] = useState("");
  const [movepiece, setMovepiece] = useState([]);
  // Clicked Tile
  const [tile, setTile] = useState("");

  const fsetBcolour = (cbcolour) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (bcolour[i][j]=="c")
        {
          cbcolour[i][j]=bcolour[i][j];
        }
      }
      
    }
    setBcolour(cbcolour);
  }

  const rookmoves = (x, y) => {
    let nmov = [];
    let xc = x - 1, yc = y - 1;
    while (xc >= 0 && game[game.length - 1][xc][y] == " ") {
      nmov.push([xc, y]);
      xc--;
    }
    if (xc >= 0 && game[game.length - 1][xc][y][0] != game[game.length-1][x][y][0]) {
      nmov.push([xc, y]);
    }
    xc = x + 1;
    while (xc <= 7 && game[game.length - 1][xc][y] == " ") {
      nmov.push([xc, y]);
      xc++;

    }
    if (xc <= 7 && game[game.length - 1][xc][y][0] != game[game.length-1][x][y][0]) {
      nmov.push([xc, y]);
    }
    while (yc >= 0 && game[game.length - 1][x][yc] == " ") {
      nmov.push([x, yc]);
      yc--;
    }
    if (yc >= 0 && game[game.length - 1][x][yc][0] != game[game.length-1][x][y][0]) {
      nmov.push([x, yc]);
    }
    yc = y + 1;
    while (yc <= 7 && game[game.length - 1][x][yc] == " ") {
      nmov.push([x, yc]);
      yc++;
    }
    if (yc <= 7 && game[game.length - 1][x][yc][0] != game[game.length-1][x][y][0]) {
      nmov.push([x, yc]);
    }
    return nmov;
  }

  const bishopmoves = (x, y) => {
    let nmov = [];
    let xc = x - 1, yc = y - 1;
    while (xc >= 0 && yc>=0 && game[game.length - 1][xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc--;
      yc--;
    }
    if (xc >= 0 && yc>=0 && game[game.length - 1][xc][yc][0] != game[game.length-1][x][y][0]) {
      nmov.push([xc, yc]);
    }
    xc = x - 1;
    yc = y + 1;
    while (xc >= 0 && yc<=7 && game[game.length - 1][xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc--;
      yc++;
    }
    xc = x + 1;
    yc = y + 1;
    while (xc <= 7 && yc<=7 && game[game.length - 1][xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc++;
      yc++;
    }
    if (xc <= 7 && yc<=7 && game[game.length - 1][xc][yc][0] != game[game.length-1][x][y][0]) {
      nmov.push([xc, yc]);
    }
    xc = x + 1;
    yc = y - 1;
    while (xc <= 7 && yc>=0 && game[game.length - 1][xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc++;
      yc--;
    }
    if (xc <= 7 && yc>=0 && game[game.length - 1][xc][yc][0] != game[game.length-1][x][y][0]) {
      nmov.push([xc, yc]);
    }
    return nmov;
  }

  const kingmoves = (x, y) => {
    let pmovs = [[x, y+1], [x, y-1], [x+1, y], [x-1, y], [x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]];
    let nmov = [];
    for (let i = 0; i < pmovs.length; i++) {
      if (pmovs[i][0]>=0 && pmovs[i][1]>=0 && pmovs[i][0]<=7 && pmovs[i][1]<=7 && (game[game.length-1][pmovs[i][0]][pmovs[i][1]]==" " || game[game.length-1][pmovs[i][0]][pmovs[i][1]][0]!=game[game.length-1][x][y][0])) 
      {
        nmov.push(pmovs[i]);
      }
    }
    return nmov;
  }

  // Calculating move of each piece
  const calcmove = (piece, x=tile[0]-'0', y=tile[1]-'0') => {
    let nmov;
    // Knight
    if (piece.length == 3) {
      const pmov = [[x + 2, y - 1], [x + 2, y + 1], [x - 2, y - 1], [x - 2, y + 1], [x + 1, y + 2], [x + 1, y - 2], [x - 1, y + 2], [x - 1, y - 2]];
      nmov = [];
      for (let i = 0; i < pmov.length; i++) {
        if (pmov[i][0] >= 0 && pmov[i][1] >= 0 && pmov[i][0] <= 7 && pmov[i][1] <= 7 && (game[game.length - 1][pmov[i][0]][pmov[i][1]] == " " || game[game.length - 1][pmov[i][0]][pmov[i][1]][0] != piece[0])) {
          nmov.push(pmov[i]);
        }
      }
    }
    // Pawn
    else if (piece[1] == "p") {
      let f = 1;
      let incr = 0;
      nmov = []
      if (game[game.length-1][x][y][0] == "w") {
        incr = 1;
      }
      else {
        incr = -1;
      }
      if (x + incr <= 7 && x + incr >= 0) {
        if (y + incr <= 7 && y + incr >= 0) {
          if (game[game.length - 1][x + incr][y + incr][0] != piece[0] && game[game.length - 1][x + incr][y + incr][0] != " ") {
            nmov.push([x + incr, y + incr]);
            f = 0;
          }
        }
        if (y - incr >= 0 && y - incr <= 7) {
          if (game[game.length - 1][x + incr][y - incr][0] != piece[0] && game[game.length - 1][x + incr][y - incr][0] != " ") {
            nmov.push([x + incr, y - incr]);
            f = 0;
          }
        }
      }
      if (f) {
        if (x + incr <= 7 && x + incr >= 0 && game[game.length - 1][x + incr][y] == " ") {

          nmov.push([x + incr, y]);
        }
        if (x == 1 && game[game.length-1][x][y][0] == "w" && game[game.length - 1][x + 2 * incr][y] == " ") {
          nmov.push([x + 2 * incr, y]);
        }
        else if (x == 6 && game[game.length-1][x][y][0] == "b" && game[game.length - 1][x + 2 * incr][y] == " ") {
          nmov.push([x + 2 * incr, y]);
        }
      }
    }
    // Rook
    else if (piece[1] == "r") {
      nmov = rookmoves(x, y);
    }
    else if (piece[1] == "b") {
      nmov = bishopmoves(x, y);
    }
    else if (piece[1]=="q") {
      nmov = bishopmoves(x, y);
      nmov = nmov.concat(rookmoves(x, y));
    }
    else if (piece[1]=="k") {
      nmov = kingmoves(x, y);
    }
    return nmov;
  }

  useEffect(() => {
    if (tile.length > 0) {
      const ctile = game[game.length - 1][tile[0] - '0'][tile[1] - '0'];
      if (bcolour[tile[0] - '0'][tile[1] - '0'] == "d") {
        let cgame = game[game.length - 1];
        cgame[tile[0] - '0'][tile[1] - ['0']] = cgame[movepiece[0]][movepiece[1]];
        cgame[movepiece[0]][movepiece[1]] = " ";
        let gamehistory = game;
        gamehistory.push(cgame);
        setGame(gamehistory);
        fsetBcolour(inbcolour);
        if (turn == "w") {
          setTurn("b");
        }
        else {
          setTurn("w");
        }
      }
      if (ctile != " ") {
        if (turn == ctile[0]) {
          setMovepiece([tile[0]-'0', tile[1]-'0']);
          setMoves(calcmove(ctile));
        }
      }
    }
  }, [tile]);

  useEffect(() => {
    let cbcolour = inbcolour;
    for (let i = 0; i < moves.length; i++) {
      cbcolour[moves[i][0]][moves[i][1]] = 'd';
    }
    fsetBcolour(cbcolour);
  }, [moves]);

  useEffect( () => {
    setBcolour(inbcolour);
    let kpos = [];
    let k=turn.concat("k");
    let opturn;
    if (turn=="w")
    {
      opturn="b";
    }
    else
    {
      opturn="w";
    }
    const cgame=game[game.length-1];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (cgame[i][j] == k)
        {
          kpos=[i, j];
          break;
        }
      }
    }
    console.log(k, kpos);
    if (kpos.length==0)
    {
      setWinner(opturn);
    }
    else
    {
      let kmoves = calcmove(k, kpos[0], kpos[1]);
      let allpmoves = [];
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (game[game.length-1][i][j][0] == opturn)
          {
            allpmoves = allpmoves.concat(calcmove(game[game.length-1][i][j], i, j));
          }
        }
      }
      let f=0;
      for (let i = 0; i < allpmoves.length; i++) {
        if (allpmoves[i][0]== kpos[0] && allpmoves[i][1]==kpos[1])
        {
          f=1;
          setCheck(true);
          let nbcolour = bcolour;
          nbcolour[kpos[0]][kpos[1]]="c";
          fsetBcolour(nbcolour);
          break;
        }
      }
      if (f)
      {
        let f1=1;
        for (let i = 0; i < kmoves.length; i++) {
          let f2=1;
          for (let j = 0; j < allpmoves.length; j++) {
            if (kmoves[i][0]==allpmoves[j][0] && kmoves[i][1]==allpmoves[i][1])
            {
              f2=0;
              break;
            }
          }
          if (f2)
          {
            f1=0;
          }
        }
        if (f1)
        {
          setWinner(opturn);
        }
      }
    }
  }, [turn]);


  const board = [];
  for (let i = 0; i < 8; i++) {
    let s, e;
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(<Square colour={chesscolours[bcolour[i][j]]} setTile={setTile} icon={(game[game.length - 1][i][j] == " ") ? " " : chessicons[game[game.length - 1][i][j]]} keyy={i.toString() + j.toString()} />)
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
