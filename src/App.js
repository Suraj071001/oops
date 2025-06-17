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

              if (solveSudoku(board)) return true;
              else {
                board[i][j] = "";
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-fit">
        <Heading />
        <Description />
        <AllCells sudoku={sudokuArr} onCell={handleCell} />
        <Controls onReset={handleReset} onSolve={handleSolve} />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <h1 className="text-center text-[36px] font-bold mb-2 text-blue-600">
      Sudoku Solver
    </h1>
  );
}

function Description() {
  return (
    <div className="text-center text-[24px]">
      <p>Enter the known numbers and click the Solve button.</p>
    </div>
  );
}

function AllCells({ sudoku, onCell }) {
  return (
    <div className="grid grid-cols-9 gap-1 w-fit mx-auto my-4">
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
  const isBoldRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
  const isBoldBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

  return (
    <input
      className={`h-[45px] w-[45px] text-[20px] font-medium text-center border border-gray-400 focus:outline-blue-400
        ${isBoldRight ? "border-r-4 border-r-gray-600" : ""}
        ${isBoldBottom ? "border-b-4 border-b-gray-600" : ""}
      `}
      type="text"
      value={data}
      maxLength="1"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "" || /^[1-9]$/.test(value)) {
          onCell(value, rowIndex, colIndex);
        }
      }}
    />
  );
}

function Result() {
  return (
    <div className="text-center text-[24px]">
      <p>Result</p>
    </div>
  );
}

function Controls({ onReset, onSolve }) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button text="Solve" onClick={onSolve} />
      <Button text="Reset" onClick={onReset} />
    </div>
  );
}

function Button({ text, onClick }) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
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
