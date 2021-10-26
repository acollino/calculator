const calcButtons = document.querySelectorAll(".buttons-container button");
const backButton = document.querySelector("#backspace");
const currButton = document.querySelector("#current-button")
const allButton = document.querySelector("#all-button");;
const current = document.querySelector("#output-current");
const history = document.querySelector("#output-history");

function operation(num1, num2, oper){
  this.num1 = null;
  this.num2 =null;
  this.per = "";
  this.solve = function(){
    return operate(oper, num1, num2);
  }
};

const equation = [];

const operands = [];
const operators = [];
let index=0;
let currentOperand = "";
let decimal = false;
let needsOperand = true;
let needsOperandNext = false;
let oldNumberPresent = false;

backButton.addEventListener("click", function(e){

})

currButton.addEventListener("click", function(e){
  current.textContent = "";
  decimal = false;
  needsOperand = true;
  needsOperandNext = false;
})

allButton.addEventListener("click", function(e){
  
})

calcButtons.forEach(button => {
  button.addEventListener("click", function(e){
    let buttonText = button.textContent;
    let textToAdd = "";
    if(isNaN(Number(buttonText))){
      if(buttonText==="+/-"){
        changePosNeg();
      }
      else if(buttonText==="="){
        equals();
      }
      else if(buttonText==="inv"){
        makeInv();
      }
      else if(buttonText==="."){
        decimal = true;
        makeDecimal();
      }
      else{
        if(needsOperand){
          textToAdd = "";
        }
        else if(needsOperandNext){
          removeOperand();
        }
        textToAdd = " "+buttonText+" ";
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

function removeOperand(){
  let curText = current.textContent.trim();
  let index = curText.lastIndexOf(" ");
  if(index>0) current.textContent = curText.substring(0, index);
}

function changePosNeg(){
  let curText = current.textContent;
  if(curText.length = 0){
    curText = "-";
  }
  else{
    if(curText.charAt(0)==='-'){
      current.textContent = curText.substring(1);
    }
    else{
      current.textContent = "-"+curText.trim();
    }
  }
}

function makeInv(){

}

function makeDecimal(){

}

function equals(){
  let curText = current.textContent;
  let textArray = curText.split(" ");
  let pos = textArray.findIndex(element => {
    let regex = /\*|\/|\-|\+|\^/g;
    return (element.search(regex)>=0);
  });
  operate(textArray[pos], Number(textArray[pos-1]), Number(textArray[pos+1]));
}

function updateOutput(newText){
  current.textContent += newText;
}

function operate(operator, num1, num2){
  let newLine = current.textContent;
  switch(operator){
    case "*":
      current.textContent = num1*num2;
      break;
    case "/":
      current.textContent = num1/num2;
      break;
    case "+":
      current.textContent = num1+num2;
      break;
    case "-":
      current.textContent = num1-num2;
      break;
    default:
      console.log("error on operator");
  }
  newLine += " = "+current.textContent;
  history.textContent = newLine+"\n"+history.textContent;
  oldNumberPresent = true;
}