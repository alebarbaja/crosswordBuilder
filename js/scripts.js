const getCrossword = document.querySelector('#crossword');
const reduceRows = document.querySelector('#rowMinus');
const cluebox = document.querySelector('.cluebox');
const answers = [];
const allIds = [];
const invalids = [];
const maxSize = 9;
const minSize = 4;
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;


//generates grid
function generateGrid(rowSize){
    for (let i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
        };
        makeCells(rowSize);
    };
generateGrid(rowSize);
let allCells = document.querySelectorAll('.crossBox');


function makeCells(rowSize){
    for (let i=gridinit; i<rowSize + 1; i++){
        let getRow = document.querySelector('#r-' + i);
        gridinit = rowSize + 1;
        for (let j=1; j<rowSize + 1; j++){
            getRow.innerHTML += `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${i}.${j}" class="crossBox crossFont row-${i} col-${j}" /></div>`;
            };
        };
}

function addToColumns(rowSize){
    for (let j=1; j<rowSize; j++){
        let getRow = document.querySelector('#r-' + j);
            getRow.insertAdjacentHTML('beforeend', 
            `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${j}.${rowSize}" class="crossBox crossFont" /></div>`);
        };
}

function checkInvalids(){
    for (id of invalids){
        let deadCell = document.getElementById(id);
        console.log(deadCell);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
        deadCell.disabled = true;
        // invalids.pop(id);
    };
}

//increase grid rowSize
const addRows = document.querySelector('#rowPlus');
addRows.addEventListener('click', function(){
    if (rowSize < maxSize){
        rowSize += 1;
        let addNewRow = getCrossword.insertAdjacentHTML('beforeend', `<div id="r-${rowSize}" class="crossRow"></div>`);
        makeCells(rowSize);
        addToColumns(rowSize);
        allCells = document.querySelectorAll('.crossBox');
        checkInvalids();
        validateLoop(initWordId);
        for (let i=0; i<initWordId.length; i++){
            validateCrossword(initWordId[i]);
        }
    };
});

//decrease grid size
const minusRows = document.querySelector('#rowMinus');
minusRows.addEventListener('click', function(){
    if (rowSize > minSize){
        let row = document.querySelector('#r-' + (rowSize - 1));
        row.nextElementSibling.remove();
        for (let j=1; j<rowSize; j++){
            let row = document.querySelector('#r-' + j);
            row.lastElementChild.remove();
        };
        allCells = document.querySelectorAll('.crossBox');
        rowSize -= 1;
        gridinit -=1;
    };
});


function validateLoop(initWordId){
if(initWordId.length <= 1){
        let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
        if (initWordId.length == 1){
        validateCrossword(initWordId[0]);
        };
        if (savedBoxList.length == 1){
            let splitter = savedBoxList[0].split(".");
            let col = splitter[1];
            let row = splitter[0];
            let el = document.getElementById(savedBoxList[0]);
            if(el.className.includes('across')){
                let els = document.querySelectorAll('.row-' + row);
                for (el of els){
                    if (el.className.includes('crossBox')){
                        el.disabled = true;
                    };
                };
            }else{
                let els = document.querySelectorAll('.col-' + col);
                for (el of els){
                    if (el.className.includes('crossBox')){
                        el.disabled = true;
                    };
                };
            };
        };
    };
}

//adds listener to children of getCrossword
let initWordId = [];
getCrossword.addEventListener('keyup', getBox, false);
function getBox(event) {
    if (event.target !== event.currentTarget) {
        let clickedItem = event.target;
        if (!clickedItem.className.includes('selected') ){
            clickedItem.className += ' selected';
        };
        if(clickedItem.value == '' && clickedItem.className.includes('selected')){
            clickedItem.classList.remove('selected'); 
        };
        let id = event.target.id;
        if (!initWordId.includes(id) && event.target.className.includes('selected')){
        initWordId.push(id);
        initWordId.sort();
        validateCrossword(id);
        };
   };
    event.stopPropagation();
    for (let id of initWordId){
        let el = document.getElementById(id);
        if (!el.className.includes('selected')){
            initWordId.pop(id);
            };
        };
    initWordId.sort();
    word_length(initWordId);
    check_gaps(initWordId);
    validateLoop(initWordId);
}

let savedBoxList = [];
getCrossword.addEventListener('click', getSavedBox, false);
function getSavedBox(el) {
    let clickedItem = el.target;
    let id = el.target.id;
    let isCrossPoint = clickedItem.className.includes('cross-point');
    let isNoReinit = clickedItem.className.includes('no-reinit');
    if (clickedItem.className.includes('savedWord') && !(clickedItem.className.includes('selected')) && !(isCrossPoint || isNoReinit)){
        clickedItem.className += ' selected';
        initWordId.push(id);
        initWordId.sort();
        savedBoxList.push(id);
    }else if(clickedItem.className.includes('savedWord') && clickedItem.className.includes('selected')){
        clickedItem.classList.remove('selected');
        initWordId.pop(id);
        savedBoxList.pop(id);
        };
    el.stopPropagation();
    validateLoop(initWordId);
    }


function validateCrossword(id){
    let selectedIdRef = id.split(".");
    let col = selectedIdRef[0];
    let row = selectedIdRef[1];
    for(cell of allCells){
        let loopIdRef = cell.id.split(".");
        let loopCol = loopIdRef[0];
        let loopRow = loopIdRef[1];
        if (!(row == loopRow || col == loopCol) || cell.className.includes('dead')){
            cell.disabled = true;
        };
    };
}

//F1. check word length and return false if too short
function word_length(ids){
    if (ids.length < 2){
        addWordBtn.disabled = true;
    }else{
        addWordBtn.disabled = false;
    };
};


//F2. make sure there are no gaps in words and return false if there is
function check_gaps(ids){
    let col_list = [];
    let row_list = [];
    let fail, row, column;
    for (id of ids){
        let splitId = id.split(".");
        col_list.push(parseInt(splitId[0]));
        row_list.push(parseInt(splitId[1]));
    };
    for (let i=col_list.length - 1; i > 0; i--){
        let j = i - 1;
        if (col_list[i] - col_list[j] > 1){
            fail = true;
        }else if (row_list[i] - row_list[j] > 1){
            fail = true;
        }else if (col_list[i] - col_list[j] == 0){
            row = true;
        }else if (row_list[i] - row_list[j] == 0){
            column = true;
        };
    };
    if(fail){
        addWordBtn.disabled = true;
    }else if(row){
        orientation = 'across';
    }else if(column){
        orientation = 'down';
    };

}

//F.reset grid
function resetGrid(){
    //i. enable all cells except savedWord
    let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
    initWordId = [];
    savedBoxList = [];
}



//3. add/initialise clue
const addWordBtn = document.querySelector('#addWord');
addWordBtn.addEventListener('click', function(){
    //i get all cells with clue
    let getLetters = document.querySelectorAll('.selected');

    //ii. init clue variable
    let clue = '';

    //iii.disable everything
    for (let cell of allCells){
            cell.disabled = true;
        };
    addWordBtn.disabled = true;

    //iv.change style for clue cells
    for (let letter of getLetters){
        clue += letter.value.toLowerCase();
        letter.style.background = 'white';  
    };

    //v. increase counter if required
    if (!document.getElementById(initWordId[0]).previousElementSibling){
        counter += 1;
    };

    //vi. insert clue into clueBox
    let insertClue = document.querySelector('#insertClue');
    insertClue.textContent = clue;
    let insertLocation = document.querySelector('#insertLocation');
    insertLocation.textContent = counter + " " + orientation;

    //vii. show clueBox
    cluebox.style.display = 'block';

    //viii.push clue to answer list
    answers.push(clue);
});



//4. confirm clue and add to clueList
let confirmClueBtn = document.querySelector('#confirmClue');
confirmClueBtn.addEventListener('click', function(){
    //i. adds and removes classes  
    let initLetterId = document.getElementById(initWordId[0]);
    for (let i=0; i<initWordId.length; i++){
        let getCell = document.getElementById(initWordId[i]);
        if(!getCell.className.includes('savedWord')){
            getCell.classList += ` savedWord ${orientation}`;
        }else{
            getCell.classList += ' cross-point';
            getCell.style.backgroundColor = '#e4e4e4';
        };
        getCell.classList.remove('selected');
        getCell.classList.remove('crossBox');
        if(i == 0){
            if(!getCell.hasAttribute('data-ep')){
                getCell.setAttribute('data-ep', 'sp');
            };
        }else if (i == initWordId.length - 1){
            if(!getCell.hasAttribute('data-ep')){
            getCell.setAttribute('data-ep', 'fp');
            };
        }else{
            if(!getCell.hasAttribute('data-ep')){
            getCell.setAttribute('data-ep', 'mp');
            };
        };
    };

    //ia - 1. endPoint validation
    let len = initWordId.length;
    let lastCell = document.getElementById(initWordId[len - 1]);
    if(orientation == 'across' && len != rowSize){
        let row = initWordId[0][0];
        let lastCol = (parseInt(initWordId[len - 1][2])) + 1;
        let endPointCellId = row + '.' + lastCol;
        if (lastCol <= rowSize){
            let deadCell = document.getElementById(endPointCellId);
            deadCell.classList.remove('crossBox');
            deadCell.classList += ' deadCell';
            }else if (!endPointCellId.includes(0)){
                invalids.push(endPointCellId);
            };

        let firstCol = initWordId[0][2];
        let precedingCellId = row + "." + (firstCol - 1);
        if (!precedingCellId.includes(0)){
            let precedingCell = document.getElementById(precedingCellId);
            precedingCell.classList.remove('crossBox');
            precedingCell.classList += ' deadCell';
        };
    };

    //ia - 2. vertical validation for deadCells //#001 fix
     if(orientation == 'down' && len != rowSize){
        let col = initWordId[0][2];
        let endPointCellId = (parseInt(initWordId[len - 1][0]) + 1) + '.' + col;
        if (endPointCellId < (rowSize + 1)){
            let deadCell = document.getElementById(endPointCellId);
            deadCell.classList.remove('crossBox');
            deadCell.classList += ' deadCell';
            }else if (!endPointCellId.includes(0)){
                invalids.push(endPointCellId);
            };

        let firstCol = initWordId[0][2];
        let precedingCellId = (parseInt(initWordId[0][0]) - 1) + '.' + col;
        if (!precedingCellId.includes(0)){
            let precedingCell = document.getElementById(precedingCellId);
            precedingCell.classList.remove('crossBox');
            precedingCell.classList += ' deadCell';
        };
     };
        

    //ia - 3. crossPoint validation for deadCells
    for (id of initWordId){
        if(!allIds.includes(id)){
        allIds.push(id);
    }else{
        let ep = document.getElementById(id).getAttribute('data-ep');
        let x = id.split(".");
        if (orientation == 'across'){
            if(id == initWordId[0]){
                if (ep == 'sp'){
                    bottomRight(x);
                    //top left L shaped clue - model 1
                }else if(ep == 'fp'){
                    topRight(x);
                    //bottom left L - model 3
                }else{
                    topRight(x);
                    bottomRight(x);
                    //mid left T - model 2
                };
            }else if(id == initWordId[initWordId.length - 1]){
                if (ep == 'sp'){
                    bottomLeft(x);
                    //top right L - model 7
                }else if(ep == 'fp'){
                    topLeft(x);
                    //bottom right L - model 9
                }else{
                    bottomLeft(x);
                    topLeft(x);
                    //mid right T - model 8
                };
            }else{
                if (ep == 'sp'){
                    bottomLeft(x);
                    bottomRight(x);
                    reinit_Model4(x);
                    //top mid T - model 4
                }else if(ep == 'fp'){
                    topLeft(x);
                    topRight(x);
                   //bottom mid T - model 6
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    topLeft(x);
                    topRight(x);
                    reinit_Model5(x);
                   //center - model 5'
                    };
                };
        }else if (orientation == 'down'){
            if(id == initWordId[0]){
                if (ep == 'sp'){
                    bottomRight(x);
                    //top left L shaped clue - model 1
                }else if(ep == 'fp'){
                    bottomLeft(x);
                    //top-right L - model 7
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    reinit_Model4(x);
                    //top mid T - model 4
                };
            }else if(id == initWordId[initWordId.length - 1]){
                if (ep == 'sp'){
                    topRight(x);
                    //bottom left L - model 3
                }else if(ep == 'fp'){
                    topLeft(x);
                    //bottom right L - model 9
                }else{
                    topRight(x);
                    topLeft(x);
                    //bottom mid T - model 8
                };
            }else{
                if (ep == 'sp'){
                    topRight(x);
                    bottomRight(x);
                    //left mid T - model 2
                }else if(ep == 'fp'){
                    topLeft(x);
                    bottomLeft(x);
                   //right mid T - model 8
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    topLeft(x);
                    topRight(x);
                    reinit_Model5(x);
                   //center - model 5'
                    };
                };
            };
        };
    allIds.sort();
    };

    
    function topLeft(x){
        let col = x[0] - 1;
        let row = x[1] - 1;
        let id = col + "." + row;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
        }

    function topRight(x){
        let row = x[0] - 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
        }

    function bottomLeft(x){
        let row = parseInt(x[0]) + 1;
        let col = x[1] - 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
    }

    function bottomRight(x){
        let row = parseInt(x[0]) + 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
    }
    
    function reinit_Model5(x){
        console.log('running reinit model');
        let col = x[0];
        let row = x[1];
        let t = (col - 1) + "." + row;
        let l = col + "." + (row - 1);
        let r = col + "." + (parseInt(row) + 1);
        let d = (parseInt(col) + 1) + "." + row;
        let tlrd = [t, l, r, d];
        for (let id of tlrd){
            let el = document.getElementById(id); 
            el.classList += ' no-reinit';
        };
    }


    function reinit_Model4(x){
        console.log('running reinit model 2.4');
        let col = x[0];
        let row = x[1];
        let t = (col - 1) + "." + row;
        let l = col + "." + (row - 1);
        let r = col + "." + (parseInt(row) + 1);
        let d = (parseInt(col) + 1) + "." + row;
        let lUp = (parseInt(col) - 1) + "." + (row - 1);
        let rUp = (parseInt(col) - 1) + "." + (parseInt(row) + 1);
        let tlrd = [d];
        if (lUp < 1){
            tlrd.push(l);
            tlrd.push(r);
        };
        for (let id of tlrd){
            let el = document.getElementById(id); 
            el.classList += ' no-reinit';
            el.style.backgroundColor = '#e4e4e4';
        };
    }
    //ii. adds number to firstLetter
    initLetterId.insertAdjacentHTML('beforeBegin', 
            `<div class="number-wrapper">${counter}</div>`);

    //iii. adds clues to clueList
    let getClueList = document.getElementById(`${orientation}`);
    const getInput = document.getElementById('clueEntry');
    let getInputVal = getInput.value;
    cluebox.style.display = 'none';
    getInput.value = '';    
    if (counter == 1){
        let clueListBlock = document.querySelector('#clueList');
        clueListBlock.style.display = 'block';
    };
    el = document.createElement('p');
    el.className = 'font-clue';
    el.textContent = `${counter}. ${getInputVal}`;
    getClueList.appendChild(el);

    //iv. resets grid for next clue
    resetGrid();
});


//5b. cancel clue
let cancelClueBtn = document.querySelector('#cancelClue');
cancelClueBtn.addEventListener('click', function(){  
    cluebox.style.display = 'none';
    insertClue = '';
    insertLocation ='';
});






