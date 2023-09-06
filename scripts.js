document.addEventListener("DOMContentLoaded", ()=> {
    const board = document.querySelector(".board")
    const button = document.querySelector(".reset-button");

    let width = 10;
    let height = 10;
    let mines = 20;
    let isGameOver = false;

    function createBoard(){
        const cells = [];
        for(let i = 0; i < width*height; i++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-index", i);
            board.appendChild(cell);
            cells.push(cell);
        }
        return cells;
    }


    function openCell(cell){
        if(isGameOver || cell.classList.contains("open")) return;
        if(cell.classList.contains("mine")){
            const mineElements = document.querySelectorAll(".mine");
            for(let i = 0; i < mineElements.length; i++){
                mineElements[i].style.backgroundColor = "red";
            }
            gameOver();
        }else{
            cell.classList.add("open");
            const index = parseInt(cell.getAttribute("data-index"));
            nearby = getNearbyMines(index);
            if(nearby == 0){
                const neighbors = getNeighbors(index);
                for(let i = 0; i < neighbors.length; i++){
                    let nearbyMines = getNearbyMines(neighbors[i]);
                    if(!cells[neighbors[i]].classList.contains("mine")){
                        openCell(cells[neighbors[i]]);
                    }
                }
            }else{
                cell.textContent = nearby;
            }
            checkForWin();
        }
    }

    function gameOver(){
        gameOver = true;
        alert("you Lost!");
    }

    function checkForWin(){
        const cells = document.querySelectorAll(".cell");
        const safeCells = Array.from(cells).filter(cell => !cell.classList.contains("mine"));
        if (safeCells.every(cell => cell.classList.contains("open"))) {
            alert("You win!");
            isGameOver = true;
        }

    }
    function getNeighbors(cellIndex){
        const neighbors = [];
        const isLeftEdge = cellIndex % width === 0;
        const isRightEdge = cellIndex % width === width-1;
        //Top
        if(cellIndex >= width) neighbors.push(cellIndex-width);
        //Top left
        if(!isLeftEdge && cellIndex >= width) neighbors.push(cellIndex-width-1);
        //Top right
        if(!isRightEdge && cellIndex >= width) neighbors.push(cellIndex-width+1);
        //left
        if(!isLeftEdge) neighbors.push(cellIndex-1);
        //right
        if(!isRightEdge) neighbors.push(cellIndex+1);
        //Bottom left
        if(!isLeftEdge && cellIndex < (width*height)-width) neighbors.push(cellIndex+width-1);
        //Bottom
        if(cellIndex < (width*height)-width) neighbors.push(cellIndex+width);
        //Bottom right
        if(!isRightEdge && cellIndex < (width*height)-width) neighbors.push(cellIndex+width+1);
        
        return neighbors;
    }

    function getNearbyMines(cellIndex){
        const neighbors = getNeighbors(cellIndex);
        let mineCount = 0;
        for (let i = 0; i < neighbors.length; i++){
            if(cells[neighbors[i]].classList.contains("mine")){
                mineCount++;
            }
        }
        return mineCount;
    }
    
    function resetGame(){
        isGameOver = false;
        board.innerHTML = "";
        cells = createBoard();
        plantMines(cells);
        cells.forEach(cell => {
            cell.textContent = "";
            cell.addEventListener("click", () => openCell(cell));
        });
    }

    function plantMines(cells){
        const randArr = [];
        for(let i = 0; i < height*width; i++){
            randArr[i] = i;
        }
        randArr.sort(()=>Math.random()-0.5);
        for (let i = 0; i < mines; i++) {
            cells[randArr[i]].classList.add("mine");
        }
    }

    button.addEventListener("click", resetGame);
    resetGame();
})