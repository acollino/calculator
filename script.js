const calcButtons = document.querySelectorAll(".buttons-container button");
const backButton = document.querySelector("#backspace");
const currButton = document.querySelector("#current-button")
const allButton = document.querySelector("#all-button");;
const current = document.querySelector("#output-current");
const history = document.querySelector("#output-history");

let equation = [];
let currentOperand = "";
let needsOperand = true;
let needsOperandNext = false;
let oldNumberPresent = false;
let decimalPossible = true;
let currentNegative = false;
let numOpenParenth = 0;

backButton.addEventListener("click", function(e){

})

currButton.addEventListener("click", function(e){
  current.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  decimalPossible = true;
  currentNegative = false;
  numOpenParenth = 0;
  equation = [];
})

allButton.addEventListener("click", function(e){
  current.textContent = "";
  history.textContent = "";//removeChildren?
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  decimalPossible = true;
  currentNegative = false;
  numOpenParenth = 0;
  equation = [];
})

calcButtons.forEach(button => {
  button.addEventListener("click", function(e){
    let buttonText = button.textContent;
    let textToAdd = "";
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
      }
      else if(buttonText==="="){
        defineEquation();
        equals();
      }
      else if(buttonText===")"){
        if(numOpenParenth>0){
          textToAdd = ")";
          numOpenParenth--;
          decimalPossible = true;
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
      else{
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
  });
});

function removeOperator(){
  let curText = current.textContent.trim();
  curText = curText.substring(0, curText.length-1);
  if(curText.lastIndexOf(" ")==curText.length-2){
    curText += " ";
  }
  current.textContent = curText;
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
    outputDiv.style.margin = "0px";
    outputDiv.style.padding = "0px";
    outputDiv.textContent = current.textContent+" = "+newText;
    history.append(outputDiv);
    if(newText==="Error"){
      current.textContent = "";
    }
    else{
      current.textContent = newText;
      oldNumberPresent = true;
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
      return textContent = num1/num2;
    case "+":
      return (num1+num2)/tempMult;
    case "-":
      return (num1-num2)/tempMult;
    default:
      return "error";
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
  while(array.indexOf("^")!=-1){
    updatedArray = doCalc(updatedArray, "^");
  }
  while(array.indexOf("*")!=-1){
    updatedArray = doCalc(updatedArray, "*");
  }
  while(array.indexOf("/")!=-1){
    updatedArray = doCalc(updatedArray, "/");
  }
  while(array.indexOf("+")!=-1){
    updatedArray = doCalc(updatedArray, "+");
  }
  while(array.indexOf("-")!=-1){
    updatedArray = doCalc(updatedArray, "-");
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
  return updatedArray;
}

function equals(){
  if(checkForUnmatchParenth()){
    equation.splice(0, 0, "(");
    equation.push(")");
    betterCalc();
    let finalIndex = equation.findIndex(element => element!=null);
    if(equation.length==0){
      updateOutput("0", true);
      needsOperand = false;
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
      }
      else{
        updateOutput(equation[finalIndex], true);
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
