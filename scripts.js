// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
  
    const getBoard = () => board;
  
    const updateBoard = (index, mark) => {
      if (board[index] === "") {
        board[index] = mark;
        return true;
      }
      return false;
    };
  
    const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };
  
    return { getBoard, updateBoard, resetBoard };
  })();
  
  // Player Factory
  const Player = (name, mark) => {
    return { name, mark };
  };
  
  // Game Controller Module
  const GameController = (() => {
    let player1, player2, currentPlayer, gameOver;
  
    const startGame = (p1Name, p2Name) => {
      player1 = Player(p1Name || "Player 1", "X");
      player2 = Player(p2Name || "Player 2", "O");
      currentPlayer = player1;
      gameOver = false;
      Gameboard.resetBoard();
      DisplayController.render();
      DisplayController.setStatus(`${currentPlayer.name}'s turn`);
    };
  
    const playRound = (index) => {
      if (gameOver || !Gameboard.updateBoard(index, currentPlayer.mark)) return;
  
      DisplayController.render();
  
      if (checkWin(currentPlayer.mark)) {
        DisplayController.setStatus(`${currentPlayer.name} wins!`);
        gameOver = true;
        return;
      }
  
      if (checkTie()) {
        DisplayController.setStatus("It's a tie!");
        gameOver = true;
        return;
      }
  
      switchPlayer();
      DisplayController.setStatus(`${currentPlayer.name}'s turn`);
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWin = (mark) => {
      const b = Gameboard.getBoard();
      const winCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      return winCombos.some(combo => combo.every(i => b[i] === mark));
    };
  
    const checkTie = () => {
      return Gameboard.getBoard().every(cell => cell !== "");
    };
  
    const restart = () => {
      gameOver = false;
      currentPlayer = player1;
      Gameboard.resetBoard();
      DisplayController.render();
      DisplayController.setStatus(`${currentPlayer.name}'s turn`);
    };
  
    return { startGame, playRound, restart };
  })();
  
  // Display Controller Module
  const DisplayController = (() => {
    const boardEl = document.getElementById("board");
    const statusEl = document.getElementById("status");
  
    const render = () => {
      boardEl.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", () => GameController.playRound(index));
        boardEl.appendChild(cellDiv);
      });
    };
  
    const setStatus = (msg) => {
      statusEl.textContent = msg;
    };
  
    return { render, setStatus };
  })();
  
  // Hook up controls
  document.getElementById("startBtn").addEventListener("click", () => {
    const p1 = document.getElementById("player1").value;
    const p2 = document.getElementById("player2").value;
    GameController.startGame(p1, p2);
  });
  
  document.getElementById("restartBtn").addEventListener("click", () => {
    GameController.restart();
  });
  