// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {dialog} = require('electron').remote;
const fs = require('fs');

const buttons = document.querySelectorAll('.operand');
const saveBtn = document.querySelector('#savebtn');
const loadBtn = document.querySelector('#loadbtn');
const textboxA = document.querySelector('#inputA');
const textboxB = document.querySelector('#inputB');
let operand = '';

function onOperandSelected(e) {
    resetResult();
    e.currentTarget.style.backgroundColor = 'red';
    const inputA = parseFloat(textboxA.value);
    const inputB = parseFloat(textboxB.value);
    operand = e.currentTarget.innerText;
    calculate(inputA, inputB, operand);
}

function calculate(inputA, inputB, operand) {
    const elem = document.querySelector('#result');
    let result = 0;
    elem.innerHTML = '';

    if (isNaN(inputA) || isNaN(inputB)) {
        elem.innerHTML ='invalid input.';
        return;
    }

    switch (operand) {
        case '+' :
            result = inputA + inputB;
            break;
        case '-' : 
            result = inputA - inputB;
            break;
        case 'x' :
            result = inputA * inputB;
            break;
        case '/' :
            result = inputA / inputB;
            break;
        default:  result = Math.pow(inputA, inputB);
    }

    elem.innerHTML = result;
    saveBtn.removeAttribute('disabled');
}

function resetResult() {
    buttons.forEach(button => {
        button.style.backgroundColor = null;
    });
    const elem = document.querySelector('#result');
    elem.innerHTML = '';
    operand = '';
}

function save(fileName) {
    const data = {
        inputA: parseFloat(textboxA.value),
        inputB: parseFloat(textboxB.value),
        operand: operand
    }
    fs.writeFileSync(fileName, JSON.stringify(data));  
}

function load(fileName) {
    if (!fileName || fileName.length <= 0) return;

    resetResult();
    const content = fs.readFileSync(fileName[0], 'utf8');
    const data = JSON.parse(content);
    textboxA.value = data.inputA;
    textboxB.value = data.inputB;
    buttons.forEach(button => {
        if (button.innerText === data.operand) {
            button.style.backgroundColor = 'red';
        }     
    })
    
    calculate(data.inputA, data.inputB, data.operand);
}

function init() {
    buttons.forEach(button => {
        button.addEventListener('click', onOperandSelected);
    });
    
    saveBtn.addEventListener('click', () => {
        dialog.showSaveDialog({filters: [{ name: 'json', extensions: ['json'] }]}, save);
    });

    loadBtn.addEventListener('click', () => {
        dialog.showOpenDialog({filters: [{ name: 'json', extensions: ['json'] }]}, load);
    });

    textboxA.addEventListener('keyup', () => {
        saveBtn.setAttribute('disabled', 'disabled');
        resetResult();
    });

    textboxB.addEventListener('keyup', () => {
        saveBtn.setAttribute('disabled', 'disabled');
        resetResult();
    });
}

init();


