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
  const [winmethod, setWinmethod] = useState("");
  const [movepiece, setMovepiece] = useState([]);
  // Clicked Tile
  const [tile, setTile] = useState("");

  const fsetBcolour = (cbcolour) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (bcolour[i][j] == "c") {
          cbcolour[i][j] = bcolour[i][j];
        }
      }

    }
    setBcolour(cbcolour);
  }

  const rookmoves = (x, y, cgame) => {
    let nmov = [];
    let xc = x - 1, yc = y - 1;
    while (xc >= 0 && cgame[xc][y] == " ") {
      nmov.push([xc, y]);
      xc--;
    }
    if (xc >= 0 && cgame[xc][y][0] != cgame[x][y][0]) {
      nmov.push([xc, y]);
    }
    xc = x + 1;
    while (xc <= 7 && cgame[xc][y] == " ") {
      nmov.push([xc, y]);
      xc++;

    }
    if (xc <= 7 && cgame[xc][y][0] != cgame[x][y][0]) {
      nmov.push([xc, y]);
    }
    while (yc >= 0 && cgame[x][yc] == " ") {
      nmov.push([x, yc]);
      yc--;
    }
    if (yc >= 0 && cgame[x][yc][0] != cgame[x][y][0]) {
      nmov.push([x, yc]);
    }
    yc = y + 1;
    while (yc <= 7 && cgame[x][yc] == " ") {
      nmov.push([x, yc]);
      yc++;
    }
    if (yc <= 7 && cgame[x][yc][0] != cgame[x][y][0]) {
      nmov.push([x, yc]);
    }
    return nmov;
  }

  const bishopmoves = (x, y, cgame) => {
    let nmov = [];
    let xc = x - 1, yc = y - 1;
    while (xc >= 0 && yc >= 0 && cgame[xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc--;
      yc--;
    }
    if (xc >= 0 && yc >= 0 && cgame[xc][yc][0] != cgame[x][y][0]) {
      nmov.push([xc, yc]);
    }
    xc = x - 1;
    yc = y + 1;
    while (xc >= 0 && yc <= 7 && cgame[xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc--;
      yc++;
    }
    xc = x + 1;
    yc = y + 1;
    while (xc <= 7 && yc <= 7 && cgame[xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc++;
      yc++;
    }
    if (xc <= 7 && yc <= 7 && cgame[xc][yc][0] != cgame[x][y][0]) {
      nmov.push([xc, yc]);
    }
    xc = x + 1;
    yc = y - 1;
    while (xc <= 7 && yc >= 0 && cgame[xc][yc] == " ") {
      nmov.push([xc, yc]);
      xc++;
      yc--;
    }
    if (xc <= 7 && yc >= 0 && cgame[xc][yc][0] != cgame[x][y][0]) {
      nmov.push([xc, yc]);
    }
    return nmov;
  }

  const kingmoves = (x, y, cgame) => {
    let pmovs = [[x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y], [x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 1], [x - 1, y - 1]];
    let nmov = [];
    for (let i = 0; i < pmovs.length; i++) {
      if (pmovs[i][0] >= 0 && pmovs[i][1] >= 0 && pmovs[i][0] <= 7 && pmovs[i][1] <= 7 && (cgame[pmovs[i][0]][pmovs[i][1]] == " " || cgame[pmovs[i][0]][pmovs[i][1]][0] != cgame[x][y][0])) {
        nmov.push(pmovs[i]);
      }
    }
    return nmov;
  }

  // Calculating move of each piece
  function calcmove(piece, cgame, x = tile[0] - '0', y = tile[1] - '0') {
    // console.log(piece);
    let nmov;

    // Knight
    if (piece.length == 3) {
      const pmov = [[x + 2, y - 1], [x + 2, y + 1], [x - 2, y - 1], [x - 2, y + 1], [x + 1, y + 2], [x + 1, y - 2], [x - 1, y + 2], [x - 1, y - 2]];
      nmov = [];
      for (let i = 0; i < pmov.length; i++) {
        if (pmov[i][0] >= 0 && pmov[i][1] >= 0 && pmov[i][0] <= 7 && pmov[i][1] <= 7 && (cgame[pmov[i][0]][pmov[i][1]] == " " || cgame[pmov[i][0]][pmov[i][1]][0] != piece[0])) {
          nmov.push(pmov[i]);
        }
      }
    }
    // Pawn
    else if (piece[1] == "p") {
      let f = 1;
      let incr = 0;
      nmov = []
      if (cgame[x][y][0] == "w") {
        incr = 1;
      }
      else {
        incr = -1;
      }
      if (x + incr <= 7 && x + incr >= 0) {
        if (y + incr <= 7 && y + incr >= 0) {
          if (cgame[x + incr][y + incr][0] != piece[0] && cgame[x + incr][y + incr][0] != " ") {
            nmov.push([x + incr, y + incr]);
            f = 0;
          }
        }
        if (y - incr >= 0 && y - incr <= 7) {
          if (cgame[x + incr][y - incr][0] != piece[0] && cgame[x + incr][y - incr][0] != " ") {
            nmov.push([x + incr, y - incr]);
            f = 0;
          }
        }
      }
      if (f) {
        if (x + incr <= 7 && x + incr >= 0 && cgame[x + incr][y] == " ") {

          nmov.push([x + incr, y]);
        }
        if (x == 1 && cgame[x][y][0] == "w" && cgame[x + 2 * incr][y] == " ") {
          nmov.push([x + 2 * incr, y]);
        }
        else if (x == 6 && cgame[x][y][0] == "b" && cgame[x + 2 * incr][y] == " ") {
          nmov.push([x + 2 * incr, y]);
        }
      }
    }
    // Rook
    else if (piece[1] == "r") {
      nmov = rookmoves(x, y, cgame);
    }
    else if (piece[1] == "b") {
      nmov = bishopmoves(x, y, cgame);
    }
    else if (piece[1] == "q") {
      nmov = bishopmoves(x, y, cgame);
      nmov = nmov.concat(rookmoves(x, y, cgame));
    }
    else if (piece[1] == "k") {
      nmov = kingmoves(x, y, cgame);
    }
    return nmov;
  }

  function getvalidmoves(mmoves, x, y) {
    let gameh = JSON.parse(JSON.stringify(game));
    let cgame = JSON.parse(JSON.stringify(gameh[gameh.length - 1]));
    let validmoves = [];
    for (let i = 0; i < mmoves.length; i++) {
      cgame = JSON.parse(JSON.stringify(gameh[gameh.length - 1]));
      cgame[mmoves[i][0]][mmoves[i][1]] = cgame[x][y];
      cgame[x][y] = " "; // Make the move
      if (incheck(cgame) == false) {
        validmoves.push(mmoves[i]);
      }
    }
    return validmoves;
  }

  const incheck = (cgame) => {
    let opturn;
    let kpos = [];
    let k = turn.concat("k");
    // Find Kingpos
    for (let i = 0; i < cgame.length; i++) {
      for (let j = 0; j < cgame.length; j++) {
        if (cgame[i][j] == k) {
          kpos = [i, j];
          break;
        }
      } 
      if (kpos.length > 0) {
        break;
      }
    }
    if (turn == "w") {
      opturn = "b";
    }
    else {
      opturn = "w";
    }
    let alloppmoves = [];
    for (let i = 0; i < cgame.length; i++) {
      for (let j = 0; j < cgame.length; j++) {
        if (cgame[i][j][0] == opturn) {
          alloppmoves = alloppmoves.concat(calcmove(cgame[i][j], cgame, i, j));
        }
      }
    }
    for (let i = 0; i < alloppmoves.length; i++) {
      if (alloppmoves[i][0] == kpos[0] && alloppmoves[i][1] == kpos[1]) {
        return true; // King is under attack
      }
    }
    return false;
  }


  useEffect(() => {
    if (tile.length > 0) {
      const ctile = game[game.length - 1][tile[0] - '0'][tile[1] - '0'];
      if (bcolour[tile[0] - '0'][tile[1] - '0'] == "d") {
        console.log('y');
        let ccgame = game[game.length - 1];
        ccgame[tile[0] - '0'][tile[1] - ['0']] = ccgame[movepiece[0]][movepiece[1]];
        ccgame[movepiece[0]][movepiece[1]] = " ";
        let gamehistory = game;
        gamehistory.push(ccgame);
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
          setMovepiece([tile[0] - '0', tile[1] - '0']); // Which piece is clicked
          setMoves(getvalidmoves(calcmove(ctile, game[game.length - 1]), tile[0] - '0', tile[1] - '0'));
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

  useEffect(() => {
    setBcolour(inbcolour);
    let kpos;
    let k = turn.concat("k");
    let allpmoves = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (game[game.length - 1][i][j][0] == turn) {
          allpmoves.push([[i, j], calcmove(game[game.length - 1][i][j], game[game.length - 1], i, j)]);
        }
        if (game[game.length - 1][i][j] == k) {
          kpos = [i, j];
        }
      }
    }
    let cgame = game[game.length - 1];
    let cbcolour = bcolour;
    let checkv = false;
    if (incheck(cgame))
    {
      setCheck(true);
      cbcolour[kpos[0]][kpos[1]] = 'c';
      checkv = true;
      setBcolour(cbcolour);
    }
    let validmoves=[];
    for (let i = 0; i < allpmoves.length; i++) {
      validmoves = validmoves.concat(getvalidmoves(allpmoves[i][1], allpmoves[i][0][0], allpmoves[i][0][1]));
    }
    if (validmoves.length==0)
    {
      setWinner((turn=='w')? 'b' : 'w');
      if (checkv)
      {
        setWinmethod('Check Mate');
      }
      else
      {
        setWinmethod('Stale Mate');
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
