const calcButtons = document.querySelectorAll(".calc-buttons-container .button");
const backButton = document.querySelector("#Backspace");
const currButton = document.querySelector("#current-button")
const allButton = document.querySelector("#all-button");;
const current = document.querySelector("#output-current");
const history = document.querySelector("#output-history");

let equation = [];
let needsOperand = true;
let needsOperandNext = false;
let oldNumberPresent = false;
let decimalPossible = true;
let divideByZero = false;
let numOpenParenth = 0;

backButton.addEventListener("click", backspace);
currButton.addEventListener("click", clearCurrent);
allButton.addEventListener("click", function(e){
  clearCurrent();
  history.textContent = "";});
calcButtons.forEach(button => button.addEventListener("click", buttonActivate));
document.addEventListener("keydown", buttonActivate);
document.addEventListener("transitionend", function(e){
  let button = e.target;
  button.classList.remove("active");});
window.addEventListener("resize", checkOutputHeight);

function backspace(){
  let charEnd = current.textContent.substring(current.textContent.length-1);
  if(charEnd===" "){
    removeOperator();
  }
  else if(current.textContent.length>0){
    switch(charEnd){
      case ".":
        decimalPossible = true;
        break;
      case "^":
        needsOperandNext = false;
        break;
      case ")":
        numOpenParenth++;
        break;
      case "(":
        numOpenParenth--;
        break;
      default:
        break;
    }
    current.textContent = current.textContent.substring(0, current.textContent.length-1);
  }
  checkEndingChar();
}

function checkEndingChar(){
  if(current.textContent.length>0){
    let charEnd = current.textContent.substring(current.textContent.length-1);
    switch(charEnd){
      case " ":
      case "^":
        needsOperandNext = true;
        break;
      case "(":
        needsOperand = true;
        break;
      default:
        needsOperandNext = false;
        break;
    }
  }
  else{
    clearCurrent();
  }
}

function clearCurrent(){
  current.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  decimalPossible = true;
  divideByZero = false;
  numOpenParenth = 0;
  equation = [];
}

function buttonActivate(e){
  let buttonText = "";
  let button;
  if(e.type==="click"){
    button = e.target;
    buttonText = e.target.textContent;
  }
  else if(e.type==="keydown"){
    buttonText = e.key;
    button = getButton(buttonText);
  }
  if(button!=null){
    button.classList.toggle("active");
    let textToAdd = "";
    if(isNaN(Number(buttonText))){
      if(buttonText==="^"||buttonText==="*"||buttonText==="/"||buttonText==="+"||buttonText==="-"){
        textToAdd = activateOperator(buttonText);
      }
      else{
        textToAdd = activateOther(buttonText);
      }
    }
    else{
      textToAdd = buttonText;
      activateOperand();
    }
    updateOutput(textToAdd);
  }
}

function getButton(buttonText){
  switch(buttonText){
    case "(": 
      return document.querySelector("#button-open");
    case ")":
      return document.querySelector("#button-close");
    case "^":
      return document.querySelector("#button-caret");
    case "/":
      return document.querySelector("#button-divide");
    case "*":
      return document.querySelector("#button-mult");
    case "-":
      return document.querySelector("#button-minus");
    case "+":
      return document.querySelector("#button-plus");
    case ".":
      return document.querySelector("#button-dec");
    case "=":
    case "Enter":
      return document.querySelector("#button-equals");
    case "Backspace":
      return document.querySelector("#Backspace");
    default:
      if(!isNaN(Number(buttonText))){
        return document.querySelector("#button-"+buttonText);
      }
      else{
        return;
      }
  }
}

function activateOther(buttonText){
  if(buttonText==="("){
    numOpenParenth++;
    if(oldNumberPresent){
      current.textContent ="("+current.textContent;
      return "";
    }
    else{
      textToAdd = "(";
      needsOperand = true;
      decimalPossible = true;
    }
    return "("
  }
  else if(buttonText===")"){
    if(numOpenParenth>0){
      numOpenParenth--;
      decimalPossible = true;
      if(oldNumberPresent===true){
        oldNumberPresent = false;
      }
      return ")";
    }
  }
  else if(buttonText==="."){
    if(decimalPossible){
      if(needsOperand||needsOperandNext){
        updateOutput("0");
        if(needsOperandNext){
          needsOperandNext = false;
        }
        if(needsOperand){
          needsOperand = false;
        }
      }
      defineEquation();
      decimalPossible = false;
      makeDecimal();
      oldNumberPresent = false;
      return ".";
    }
  }
  else if(buttonText==="Backspace"){
    backspace();
  }
  else if(buttonText==="="||buttonText==="Enter"){
    defineEquation();
    equals();
  }
  return "";
}

function activateOperand(){
  if(oldNumberPresent){
    current.textContent = "";
    oldNumberPresent = false;
  }
  if(needsOperand){
    needsOperand = false;
  }
  if(!needsOperand&&needsOperandNext){
    needsOperandNext = false;
  }
}

function activateOperator(buttonText){
  let text = " "+buttonText+" ";
  if(needsOperandNext){
    removeOperator();
  }
  if(needsOperand){
    updateOutput("0");
    needsOperand = false;
  }
  if(buttonText==="^"){
    text = "^";
  }
  decimalPossible = true;
  needsOperandNext = true;
  oldNumberPresent = false;
  return text;
}

function removeOperator(){
  let curText = current.textContent.trim();
  curText = curText.substring(0, curText.length-1);
  current.textContent = curText.trim();;
}

function makeDecimal(){
  let index = equation.length-1;
  for(let x=equation.length-1; x>=0; x--){
    if(!Number.isNaN(equation[x])){
      index = x;
    }
  }
  equation[index] = equation[index]+".";
}

function updateOutput(newText, fromEquals){
    if(!fromEquals){
      current.textContent = current.textContent+newText;
    }
    else{
      let outputDiv = document.createElement("div");
      outputDiv.style.borderStyle = "none";
      outputDiv.style.padding = "0px";
      outputDiv.textContent = current.textContent+" = "+newText;
      history.append(outputDiv);
      checkOutputHeight();
      if(isNaN(Number(newText))){
        current.textContent = "";
      }
      else{
        current.textContent = newText;
      }
    }
}

function checkOutputHeight(){
  while(history.firstChild!=null&&history.firstChild.getBoundingClientRect().bottom+parseFloat(window.getComputedStyle(history).getPropertyValue("padding"))>=history.getBoundingClientRect().bottom){
    history.firstChild.remove();
  }
}

function getFirstVisibleChild(){
  let children = history.children;
  for(let x=0; x<children.length; x++){
    if(children[x].style.display===""){
      return x;
    }
  }
}

function operate(operator, num1, num2){
  let decNum1 = numberDecimalPlaces(num1);
  let decNum2 = numberDecimalPlaces(num2);
  let tempMult = 1;
  if(decNum1>0||decNum2>0){
    if(decNum1>decNum2){
      tempMult = Math.pow(10, decNum1);
    }
    else{
      tempMult = Math.pow(10, decNum2);
    }
  }
  num1 *= tempMult;
  num2 *= tempMult;
  switch(operator){
    case "^":
      num2 = num2/tempMult;
      return (Math.pow(num1,num2))/Math.pow(tempMult, num2);
    case "*":
      return (num1*num2)/(tempMult*tempMult);
    case "/":
      if(num2===0){
        divideByZero = true;
        return Infinity;
      }
      else return textContent = num1/num2;
    case "+":
      return (num1+num2)/tempMult;
    case "-":
      return (num1-num2)/tempMult;
    default:
      return "Error";
  }
}

function defineEquation(){
  equation = current.textContent.trimEnd().split(/\s|(\()|(\))|(\^)/).filter(el => el!=null&&el.length>0);
}

function calculateByParenth(){
  let targetPair = findInnerMostParenth();
  let subSection = [];
  for(let x=targetPair[0]+1; x<targetPair[1]; x++){
    subSection.push(equation[x]);
  }
  let updatedSection = orderOps(subSection);
  equation.splice(targetPair[0], targetPair[1]-targetPair[0]+1, ...updatedSection);
  if(equation.length>1){
    calculateByParenth();
  }
}

function findInnerMostParenth(){
  let endPar = equation.indexOf(")");
  let firstPar = equation.lastIndexOf("(", endPar);
  return [firstPar, endPar];
}

function orderOps(array){
  let updatedArray = array;
  while(updatedArray.indexOf("^")!=-1){
    updatedArray = validateOperation(updatedArray, "^");
  }
  while(updatedArray.indexOf("*")!=-1||updatedArray.indexOf("/")!=-1){
    let operatorA = updatedArray.indexOf("*");
    let operatorB = updatedArray.indexOf("/");
    if(operatorB==-1||operatorA>=0&&operatorA<operatorB){
      updatedArray = validateOperation(updatedArray, "*");
    }
    else{
      updatedArray = validateOperation(updatedArray, "/");
    }
  }
  while(updatedArray.indexOf("+")!=-1||updatedArray.indexOf("-")!=-1){
    let operatorA = updatedArray.indexOf("+");
    let operatorB = updatedArray.indexOf("-");
    if(operatorB==-1||(operatorA>=0&&operatorA<operatorB)){
      updatedArray = validateOperation(updatedArray, "+");
    }
    else{
      updatedArray = validateOperation(updatedArray, "-");
    }
  }
  return updatedArray;
}

function validateOperation(array, operator){
  let updatedArray = array;
  let newVal = 0;
  let index = updatedArray.indexOf(operator);
  if(index>0){
    newVal = operate(operator, Number(updatedArray[index-1]), Number(updatedArray[index+1]));
    updatedArray.splice(index-1, 3, newVal);
  }
  else if(index===0){
    newVal = operate("Error", 1, 1);
    updatedArray.splice(index, 2, newVal);
  }
  return updatedArray;
}

function equals(){
  checkForMissingMult();
  if(checkForUnmatchParenth()){
    equation.splice(0, 0, "(");
    equation.push(")");
    calculateByParenth();
    let finalIndex = equation.findIndex(element => element!=null);
    if(equation.length==0){
      updateOutput("0", true);
      needsOperand = false;
      oldNumberPresent = true;
    }
    else{
      decimalPossible = true;
      if(!Number.isInteger(Number(equation[finalIndex]))){
        if(numberDecimalPlaces(equation[finalIndex])>5){
          equation[finalIndex] = equation[finalIndex].toFixed(5);
        }
        decimalPossible = false;
      }
      if(Number.isNaN(equation[finalIndex])){
        updateOutput("Error", true);
        oldNumberPresent = false;
        needsOperand = true;
        return;
      }
      if(divideByZero){
        updateOutput("Cannot divide by 0", true);
        oldNumberPresent = false;
        needsOperand = true;
        divideByZero = false;
        return;
      }
      else{
        updateOutput(Number(equation[finalIndex]), true);
        oldNumberPresent = true;
      }
    }
  }
}

function checkForUnmatchParenth(){
  while(numOpenParenth>0){
    equation.push(")");
    numOpenParenth--;
    updateOutput(")");
  }
  return equation.length>0;
}

function numberDecimalPlaces(num){
  let finalVal = num.toString();
  if(finalVal.indexOf(".")!=-1){
    return finalVal.length-1-finalVal.indexOf(".");
  }
  return -1;
}

function checkForMissingMult(){
  let priorValue = equation[0]
  let currentValue;
  for(let x=1; x<equation.length; x++){
    currentValue = equation[x];
    if(!Number.isNaN(Number(priorValue))&&currentValue==="("||priorValue===")"&&!Number.isNaN(Number(currentValue))||priorValue===")"&&currentValue==="("){
      equation.splice(x, 0, "*");
      x++;
    }
    priorValue = equation[x];
  }
}