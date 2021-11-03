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

function backspace(){
  console.log("on start, current is|"+current.textContent+"|");
  let charEnd = current.textContent.substring(current.textContent.length-1);
  // if(needsOperandNext&&!needsOperand){
    if(charEnd===" "){
    console.log("remove operator");
    removeOperator();
    decimalPossible = true;
  }
  else if(current.textContent.length>0){
    console.log("remove non-operator");
    if(charEnd===")"){
      numOpenParenth++;
    }
    else if(charEnd==="("){
      numOpenParenth--;
      needsOperand = false;
    }
    else if(charEnd==="."){
      decimalPossible = true;
    }
    current.textContent = current.textContent.substring(0, current.textContent.length-1);
    if(current.textContent.length>0){
      console.log("not clearing");
      charEnd = current.textContent.substring(current.textContent.length-1);
      if(charEnd===" "){
        needsOperandNext = true;
      }
    }
    else{
      console.log("should be clearing");
      clearCurrent();
    }
  }
}

currButton.addEventListener("click", clearCurrent);

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

allButton.addEventListener("click", function(e){
  clearCurrent();
  history.textContent = "";
});

document.addEventListener("transitionend", function(e){
  let button = e.target;
  button.classList.remove("active");
})

function buttonActivate(e){
  let buttonText = "";
  let textToAdd = "";
  let button;
  if(e.type==="click"){
    button = e.target;
    buttonText = e.target.textContent;
  }
  else if(e.type==="keyup"){
    buttonText = e.key;
    switch(buttonText){
      case "(": 
        button = document.querySelector("#button-open");
        break;
      case ")":
        button = document.querySelector("#button-close");
        break;
      case "^":
        button = document.querySelector("#button-caret");
        break;
      case "/":
        button = document.querySelector("#button-divide");
        break;
      case "*":
        button = document.querySelector("#button-mult");
        break;
      case "-":
        button = document.querySelector("#button-minus");
        break;
      case "+":
        button = document.querySelector("#button-plus");
        break;
      case ".":
        button = document.querySelector("#button-dec");
        break;
      case "=":
      case "Enter":
        button = document.querySelector("#button-equals");
        break;
      case "Backspace":
        backspace();
        button = document.querySelector("#Backspace");
        break;
      default:
        if(!isNaN(Number(buttonText))){
          button = document.querySelector("#button-"+buttonText);
        }
        else{
          return;
        }
    }
  }
  button.classList.add("active");
  if(isNaN(Number(buttonText))){
    if(buttonText==="("){
      if(oldNumberPresent){
        current.textContent ="("+current.textContent;
      }
      else{
        textToAdd = "(";
      }
      numOpenParenth++;
      decimalPossible = true;
      if(!oldNumberPresent){
        needsOperand = true;
      }
    }
    else if(buttonText==="="||buttonText==="Enter"){
      defineEquation();
      equals();
    }
    else if(buttonText===")"){
      if(numOpenParenth>0){
        textToAdd = ")";
        numOpenParenth--;
        decimalPossible = true;
        if(oldNumberPresent===true){
          oldNumberPresent = false;
        }
      }
    }
    else if(buttonText==="."){
      if(decimalPossible){
        if(needsOperand||needsOperandNext){
          updateOutput("0");
        }
        defineEquation();
        decimalPossible = false;
        makeDecimal();
        textToAdd = ".";
        oldNumberPresent = false;
      }
    }
    else if(buttonText==="^"||buttonText==="*"||buttonText==="/"||buttonText==="+"||buttonText==="-"){
      if(needsOperandNext){
        removeOperator();
      }
      if(needsOperand){
        updateOutput("0");
        needsOperand = false;
      }
      textToAdd = " "+buttonText+" ";
      if(buttonText==="^"){
        textToAdd = "^";
      }
      decimalPossible = true;
      needsOperandNext = true;
      oldNumberPresent = false;
    }
  }
  else{
    textToAdd = buttonText;
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
  updateOutput(textToAdd);
}

calcButtons.forEach(button => button.addEventListener("click", buttonActivate));

document.addEventListener("keyup", buttonActivate);

function removeOperator(){
  let curText = current.textContent.trim();
  curText = curText.substring(0, curText.length-1);
  current.textContent = curText.trim();;
}

function makeDecimal(){
  let index = getLastOperandIndex();
  equation[index] = equation[index]+".";
}

function getLastOperandIndex(){
  for(let x=equation.length-1; x>=0; x--){
    if(!Number.isNaN(equation[x])){
      return x;
    }
  }
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
  if(history.firstElementChild.getBoundingClientRect().bottom>history.getBoundingClientRect().bottom){
    history.firstElementChild.remove();
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

function betterCalc(){
  let targetPair = findInnerMostParenth();
  let subSection = [];
  for(let x=targetPair[0]+1; x<targetPair[1]; x++){
    subSection.push(equation[x]);
  }
  let updatedSection = orderOps(subSection);
  equation.splice(targetPair[0], targetPair[1]-targetPair[0]+1, ...updatedSection);
  if(equation.length>1){
    betterCalc();
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
    updatedArray = doCalc(updatedArray, "^");
  }
  while(updatedArray.indexOf("*")!=-1||updatedArray.indexOf("/")!=-1){
    let operatorA = updatedArray.indexOf("*");
    let operatorB = updatedArray.indexOf("/");
    if(operatorB==-1||operatorA>=0&&operatorA<operatorB){
      updatedArray = doCalc(updatedArray, "*");
    }
    else{
      updatedArray = doCalc(updatedArray, "/");
    }
  }
  while(updatedArray.indexOf("+")!=-1||updatedArray.indexOf("-")!=-1){
    let operatorA = updatedArray.indexOf("+");
    let operatorB = updatedArray.indexOf("-");
    if(operatorB==-1||(operatorA>=0&&operatorA<operatorB)){
      updatedArray = doCalc(updatedArray, "+");
    }
    else{
      updatedArray = doCalc(updatedArray, "-");
    }
  }
  return updatedArray;
}

function doCalc(array, value){
  let updatedArray = array;
  let newVal = 0;
  let index = -1;
  index = updatedArray.indexOf(value);
  if(index>0){
    newVal = operate(value, Number(updatedArray[index-1]), Number(updatedArray[index+1]));
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
    betterCalc();
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
        updateOutput(equation[finalIndex], true);
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