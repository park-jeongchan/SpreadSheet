const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;

const spredsheet = [];






class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.active = active;

        this.rowName = rowName;
        this.columnName = columnName;
    }
}

exportBtn.onclick = function (e) {
    let csv = "";
    
    for (let i = 0; i < spredsheet.length; i++) {
        if(i ===0) continue;
        csv += spredsheet[i]
            .filter((item) => !item.isHeader)
            .map((item) => item.data)
            .join(",") + "\r\n";
    }


    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log("csv", csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "Spreadsheet File Name.csv";
    a.click();
};

initSpredSheet();




function initSpredSheet() {
    for (let i = 0; i < ROWS; i++) {
        let spredsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = "";
            let isHeader = false;
            let disabled = false;
            const letter = String.fromCharCode(64 + j);

            const rowName = i;
            const columnName = letter;


            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cellData = letter;
                isHeader = true;
                disabled = true;

            }

            if (i === 0 && j === 0) {
                cellData = ""
            }

            if (cellData <= 0) {
                cellData = "";
            }

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spredsheetRow.push(cell);

        }
        spredsheet.push(spredsheetRow);

    }
    drawSheet();
}


function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.className = "cell";
    cellEl.id = "cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

function handleOnChange(data1, cell) {
    cell.data = data1;
}

function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spredsheet[0][cell.column];
    const rowHeader = spredsheet[cell.row][0];

    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");

    document.querySelector("#cell-status").innerHTML = cell.columnName + "" +cell.rowName;

}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStates() {
    const headers = document.querySelectorAll(".header");

    headers.forEach((header) => {
        header.classList.remove("active");
    });
}
function drawSheet() {

    for (let i = 0; i < spredsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for (let j = 0; j < spredsheet[i].length; j++) {
            const cell = spredsheet[i][j];
            rowContainerEl.append(createCellEl(cell));

        }
        spreadSheetContainer.append(rowContainerEl);

    }
}

