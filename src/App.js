import { useState } from "react";

const sudoku = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

export default function App() {
  const [sudokuArr, setSudokuArr] = useState(sudoku);

  function handleCell(data, row, col) {
    setSudokuArr((sudokuArr) => {
      var newArray = [];

      for (var i = 0; i < sudokuArr.length; i++)
        newArray[i] = sudokuArr[i].slice();

      newArray[row][col] = data;
      return newArray;
    });
  }

  function handleSolve() {
    var newArray = [];

    for (var i = 0; i < sudokuArr.length; i++)
      newArray[i] = sudokuArr[i].slice();

    solveSudoku(newArray);
    setSudokuArr(newArray);
  }

  function handleReset() {
    setSudokuArr(sudoku);
  }

  function solveSudoku(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === "") {
          for (let k = 1; k <= 9; k++) {
            if (isSafe(board, i, j, k.toString())) {
              board[i][j] = k.toString();
              setTimeout(() => {
                handleCell(k.toString(), i, j);
              }, 1000);

              if (solveSudoku(board)) return true;
              else {
                board[i][j] = "";
                setTimeout(() => {
                  handleCell("", i, j);
                }, 1000);
              }
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  return (
    <div className="main">
      <Heading />
      <Description />
      <AllCells sudoku={sudokuArr} onCell={handleCell} />
      <Result />
      <Controls onReset={handleReset} onSolve={handleSolve} />
    </div>
  );
}

function Heading() {
  return <h1>Sudoku Solver</h1>;
}

function Description() {
  return (
    <div className="description">
      <p>Enter the known numbers and click the Solve button.</p>
    </div>
  );
}

function AllCells({ sudoku, onCell }) {
  return (
    <div className="allCells">
      {sudoku.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          return (
            <Cell
              data={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onCell={onCell}
            />
          );
        })
      )}
    </div>
  );
}

function Cell({ data, rowIndex, colIndex, onCell }) {
  return (
    <input
      type="text"
      value={data}
      onChange={(e) => onCell(e.target.value, rowIndex, colIndex)}
    />
  );
}

function Result() {
  return (
    <div className="result">
      <p>Result</p>
    </div>
  );
}

function Controls({ onReset, onSolve }) {
  return (
    <div className="controls">
      <Button text="Solve" onClick={onSolve} />
      <Button text="Reset" onClick={onReset} />
    </div>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function isSafe(board, row, col, num) {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // Check 3x3 grid
  let startRow = 3 * Math.floor(row / 3);
  let startCol = 3 * Math.floor(col / 3);

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
}
