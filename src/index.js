module.exports = function solveSudoku(matrix) {
  let fleg = false;
  let count = 0;
  let change = 0;
  while (!fleg) {
    for (let i = 0; i < SIZE_MATRIX; i++) {
      for (let j = 0; j < SIZE_MATRIX; j++) {
        if (matrix[i][j] === 0) {
          matrix[i][j] = findNumberCell(matrix, i, j);
          if (matrix[i][j] !== 0) { ++change; }
        }
      }
    }

    console.log(++count);
    // if(count > 1){
    //   break;
    // }
    fleg = isSolvedSudoku(matrix);
    if (change === 0) {
      console.log("not solve");
      break;
    } else {
      console.log("change", change);
      change = 0;
    }

  }

  console.log(matrix);
  return matrix;

}

const SIZE_MATRIX = 9;
const FULL_LINE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function findNumberCell(array, row, col) {
  let vertHorzPlusBlock = [].concat(
    getHorizontalLine(array, row),
    getVerticalLine(array, col),
    getSmallSquare(array, getBLockNumber(row, col))
  );
  let unique = new Set(vertHorzPlusBlock);
  let neighboringRepeat = neighboringSmallSquares(array, getBLockNumber(row, col));
  let busyNumber = numbersIncludesInAllSquares(neighboringRepeat);
  let getSolveNumber = busyNumber.filter(item => !unique.has(item))

  // cross small blocks method
  if(getSolveNumber.length > 0){
    console.log("getSolveNumber =", getSolveNumber, `(${row}, ${col})`)
    return getSolveNumber[0];
  }

  // simple method
  if (unique.size === 8) {
    getSolveNumber = FULL_LINE.filter(item => !unique.has(item));
    return getSolveNumber[0];
  }

  // last hero method

  return 0;
}

function lastHero(array, numBlock){
  
}

function isSolvedSudoku(array) {
  let line;
  for (let i = 0; i < array.length - 1; i++) {
    line = new Set(array[i]);
    if (line.has(0)) {
      return false;
    }
  }
  return true;
}

// k row`s number (from 0 to SIZE_MATRIX-1)
function getHorizontalLine(array, k) {
  if (range(0, SIZE_MATRIX - 1)) {
    return array[k].filter(x => x !== 0);
  }
  return [];
}

// k  column`s number (from 0 to SIZE_MATRIX-1)
function getVerticalLine(array, k) {
  let result = [];
  if (range(0, SIZE_MATRIX - 1)) {
    for (let d = 0; d < SIZE_MATRIX; d++) {
      result.push(array[d][k]);
    }
    return result.filter(x => x !== 0)
  }
  return [];
}

function getBLockNumber(n, m) {
  const BLOCK = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  let rowBlock = n < 3 ? 1 : n > 5 ? 3 : 2;
  let colBlock = m < 3 ? 1 : m > 5 ? 3 : 2;
  return BLOCK[rowBlock - 1][colBlock - 1];
}

function numbersIncludesInAllSquares(allNumbersFourSquare){
  let array = allNumbersFourSquare.sort(function (a, b) {return a - b});
  let result = [];
  let repeat = 0;

  for(let i = 0; i < array.length-1; i++){
    if(array[i] === array[i+1]){
      repeat++;
    } else {
      repeat = 0;
    }

    if(repeat === 3){
      result.push(array[i]);
      repeat = 0;
    }
  }

  return result;
}

function neighboringSmallSquares(array, n) {
  let result = [];
  // console.log("n = ", n);
  // direction left
  if (n - 1 > 0) {
    // console.log("left =", n - 1)
    result.push(...getSmallSquare(array, n - 1));
  } else {
    // console.log("left =", n + 2);
    result.push(...getSmallSquare(array, n + 2));
  }

  //direction right
  if (n  % 3 !== 0) {
    // console.log("right =", n + 1);
    result.push(...getSmallSquare(array, n + 1));
  } else {
    // console.log("right =", n - 2);
    result.push(...getSmallSquare(array, n - 2));
  }

  //direction up
  if (n - 3 > 0) {
    // console.log("up =", n-3)
    result.push(...getSmallSquare(array, n - 3));
  } else {
    // console.log("up =", n + 6);
    result.push(...getSmallSquare(array, n + 6));
  }

  //direction down
  if (n + 3 < 10) {
    // console.log("down =", n + 3);
    result.push(...getSmallSquare(array, n + 3));
  } else {
    // console.log("down =", n - 6);
    result.push(...getSmallSquare(array, n - 6));
  }

  // console.log("neighboringSmallSquare:",result);
  return result;
}

// n is coordinate small square (from 1 to SIZE_MATRIX)
function getSmallSquare(array, n) {
  let result = [];
  if (range(1, SIZE_MATRIX)) {
    let kr = searchCoefRow(n);
    let kc = searchCoefColumn(n);
    for (let h = 0; h < 3; h++) {
      for (let w = 0; w < 3; w++) {
        if (array[3 * kr + h][3 * kc + w] !== 0) {
          result.push(array[3 * kr + h][3 * kc + w]);
          // console.log(`(${3 * kr + h}, ${3 * kc + w})`)
        }
      }

    }
    return result;
  }
  return [];
}

function range(a, b, k) {
  if (k < a || k > b) {
    return false;
  }
  return true;
}

// search coeficient(row) small square;
function searchCoefRow(n) {
  let coef = Math.floor(n / 3);
  if (n % 3 === 0) {
    coef = coef - 1;
  }
  // console.log("coef =", coef, n);
  return coef;
}

// search coeficient(column) small square;
function searchCoefColumn(n) {
  let coef;
  if (n % 3 === 1) {
    coef = 0;
  } else if (n % 3 === 2) {
    coef = 1
  } else {
    coef = 2;
  }
  // console.log("coefColum =", coef);
  return coef;
}


let initial = [
  [6, 5, 0, 7, 3, 0, 0, 8, 0],
  [0, 0, 0, 4, 8, 0, 5, 3, 0],
  [8, 4, 0, 9, 2, 5, 0, 0, 0],
  [0, 9, 0, 8, 0, 0, 0, 0, 0],
  [5, 3, 0, 2, 0, 9, 6, 0, 0],
  [0, 0, 6, 0, 0, 0, 8, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 6],
  [0, 0, 7, 0, 0, 0, 0, 5, 0],
  [1, 6, 5, 3, 9, 0, 4, 7, 0]
];

let initial2 = [
  [5, 3, 4, 6, 7, 8, 9, 0, 0],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

let func = require('./index');
func(initial);
