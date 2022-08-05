let score = (function (){
    const gridElement = document.querySelector('.grid-container');
const gameOverElement = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const tryAgainButton = document.querySelector('.try-again');
const bestScoreElement = document.querySelector('.best');
const scoreElement = document.querySelector('.score-value');

// console.log(bestScore,scoreValue, "first");
var testing = 789;
let bestScore = localStorage.getItem('best') || 0;
let cells = [];
let scoreValue = 0;
let cellValues = [];
console.log(bestScore,scoreValue);

function createGrid(){
    for(let i=0;i<16;i++){
        let cellElement = document.createElement('div');
        cellElement.classList.add("cell","empty");
        gridElement .append(cellElement);
        cells.push(cellElement);
    }
}

function checkGameOver(){
    let isNotOver = cellValues.some((value,index) => {
        return ((value === cellValues[index+4]) || (index%4!==3 && value === cellValues[index+1]));
    })
    if(isNotOver) return;
    gameOverElement.classList.remove('hide');
}

function generateNewValue(){
    let emptyCells = []
    cellValues.forEach((value,index) => {
        if(value===0) emptyCells.push(index);
    })
    if(emptyCells.length===0){
        return;
    }

    let random = Math.floor(Math.random() * emptyCells.length);
    let newIndex = emptyCells[random];

    if(Math.random()<0.8) cellValues[newIndex] = 2;
    else cellValues[newIndex] = 4;
    cells[newIndex].innerHTML = cellValues[newIndex];
    cells[newIndex].classList.remove("empty");

    if(emptyCells.length===1){
        checkGameOver();
    }
}

function initializeGame(){
    createGrid();
    bestScoreElement.innerHTML = bestScore;
    scoreElement.innerHTML = 0;
    gameOverElement.classList.add('hide');
    for(let i=0;i<16;i++) cellValues[i] = 0;
    generateNewValue();
    generateNewValue();
}

function setScore(scoreValue){
    if(scoreValue>bestScore){
        bestScore = scoreValue;
        localStorage.setItem('best',bestScore);
        bestScoreElement.innerHTML = bestScore; 
    }
    scoreElement.innerHTML = scoreValue;
}

function updateGame(traverseOrder){
    for(let row of traverseOrder){
        let prevCell = {
            value: -1,
            index: -1,
            canMerge: false,
        };
        let nextFill = 0;
        for(let col=0;col<row.length;col++){
            let currIndex = row[col];

            if(cellValues[currIndex]===0) continue;
            if(prevCell.canMerge && prevCell.value === cellValues[currIndex]){
                prevCell.value += cellValues[currIndex];
                cellValues[prevCell.index] = prevCell.value;
                scoreValue += prevCell.value;
                prevCell.canMerge = false;
                cellValues[currIndex] = 0;
                setScore(scoreValue);   
            }
            else{
                let temp = cellValues[currIndex];
                cellValues[currIndex] = 0;
                cellValues[row[nextFill]] = temp;
                prevCell.index = row[nextFill];
                prevCell.value = temp;
                prevCell.canMerge = true;
                nextFill++;
            }
            cells[currIndex].innerHTML = "";
            cells[prevCell.index].innerHTML = prevCell.value;
            cells[currIndex].classList.add("empty");
            cells[prevCell.index].classList.remove("empty");

        }
    }
}

function getMoveLeftOrder(){
    let traverseOrder = []
    for(let row=0; row<4; row++){
        let temp = []
        for(let col=0; col<4; col++){
            temp.push(row*4+col);
        }
        traverseOrder.push(temp);
    }
    return traverseOrder;
}

function getMoveRightOrder(){
    let traverseOrder = []
    for(let row=0; row<4; row++){
        let temp = []
        for(let col=3; col>=0; col--){
            temp.push(row*4+col);
        }
        traverseOrder.push(temp);
    }
    return traverseOrder;
}

function getMoveUpOrder(){
    let traverseOrder = []
    for(let col=0; col<4; col++){
        let temp = []

        for(let row=0; row<4; row++){
            temp.push(row*4+col);
        }
        traverseOrder.push(temp);
    }
    return traverseOrder
}

function getMoveDownOrder(){
    let traverseOrder = []
    for(let col=0; col<4; col++){
        let temp = []
        for(let row=3; row>=0; row--){
            temp.push(row*4+col);
        }
        traverseOrder.push(temp);
    }
    return traverseOrder;
}


let gridTraveseOrder = {
    moveLeft: getMoveLeftOrder(),
    moveRight: getMoveRightOrder(),
    moveUp: getMoveUpOrder(),
    moveDown: getMoveDownOrder(),
}

function handleKeyDown(event){
    switch(event.key){
        case "ArrowLeft": updateGame(gridTraveseOrder.moveLeft);
        break;
        case "ArrowRight": updateGame(gridTraveseOrder.moveRight);
        break;
        case "ArrowUp": updateGame(gridTraveseOrder.moveUp);
        break;
        case "ArrowDown": updateGame(gridTraveseOrder.moveDown);
        break;
        default: return;
   }
   generateNewValue();
}

function handleRestart(){
    gridElement.innerHTML = "";
    cellValues.length = 0;
    cells.length = 0;
    scoreValue = 0;
    initializeGame();
}

initializeGame();
document.addEventListener("keydown",(event) => handleKeyDown(event));
restartButton.addEventListener("click",handleRestart);
tryAgainButton.addEventListener("click",handleRestart);

return scoreValue;
})();