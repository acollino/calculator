const calcButtons = document.querySelectorAll(".buttons-container button");
const backButton = document.querySelector("#backspace");
const currButton = document.querySelector("#current-button")
const allButton = document.querySelector("#all-button");;
const current = document.querySelector("#output-current");
const history = document.querySelector("#output-history");

function operation(num1, num2, oper){
  this.num1 = num1;
  this.num2 =num2;
  this.oper = oper;
  this.solve = function(){
    return operate(oper, num1, num2);
  }
};

let equation = [];

let operands = [];
let operators = [];
let indexStart=0;
let indexEnd=0;
let currentOperand = "";
let needsOperand = true;
let needsOperandNext = false;
let oldNumberPresent = false;
let currentDecimal = false;
let currentNegative = false;

backButton.addEventListener("click", function(e){

})

currButton.addEventListener("click", function(e){
  current.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  currentDecimal = false;
  currentNegative = false;
})

allButton.addEventListener("click", function(e){
  current.textContent = "";
  history.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  currentDecimal = false;
  currentNegative = false;
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
        operands = [];
        operators = [];
        defineEquation();
        equals();
      }
      else if(buttonText==="1/x"){
        addParenth();
        makeInv();
      }
      else if(buttonText==="."){
        decimal = true;
        makeDecimal();
      }
      else{
        if(needsOperandNext){
          removeOperator();
        }
        if(!needsOperand){
          textToAdd = " "+buttonText+" ";
          if(buttonText==="^"){
            addParenth();
            textToAdd = "^";
          }
        }
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

function addParenth(){
  if(current.textContent.length>0){
    current.textContent = "("+current.textContent + ")";
  } 
}

function removeOperator(){
  let curText = current.textContent.trim();
  if(curText.indexOf("(")==0){
    current.textContent = curText.substring(1, curText.length-2);
  }
  else{
    let index = curText.lastIndexOf(" ");//last whitespace will be before operand
    if(index>0){
      current.textContent = curText.substring(0, index);
    }
  }
}

function changePosNeg(){
  let curText = current.textContent;
  if(curText.length == 0){
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

function betweenParenth(index1, index2){
  // let startParenth = operators.lastIndexOf("(", index1);
  // let endParenth = operators.indexOf(")", index2);
  // if(startParenth === endParenth === -1){
  //   multiplyOrDivide(index1, index2);
  // }
  // else{
  //   //equals(startParenth+1, endParenth-1);
  // }
  let subArray = [];
  for(let x=index1; x<=index2; x++){
    subArray[x] = operators[x];
  }
  let startParenth = subArray.indexOf("(", index1);
  let endParenth = subArray.lastIndexOf(")", index2);
  if(startParenth == -1&&endParenth==-1){
    multiplyOrDivide(index1, index2);
    // operators.splice(pos);
  }
  else{
    betweenParenth(startParenth+1, endParenth-1);
  }
}

function multiplyOrDivide(index1, index2){
  // console.log(`operators: ${operators}, operands: ${operands}`);
  // if(operators.length>0){
    let subArray = [];
    let end = operators.length-1;
    if(index2<end){
      end = index2;
    }
    for(let x=index1; x<=end; x++){
      subArray[x] = operators[x];
    }
    pos = -1;
    pos = subArray.findIndex(element => {
          let regex = /\*|\//;
          return (element.search(regex)>=0);
    });
    if(pos>=0){
      ans = operate(operators[pos], operands[pos], operands[pos+1]);
      operands.splice(pos, 2, ans);
      operators.splice(pos, 1);
      multiplyOrDivide(index1, index2);
    }
    else{
      addOrSubtract(index1, index2);
    }
  // }
}

function addOrSubtract(index1, index2){
  //console.log(`operators: ${operators}, operands: ${operands}`);
  // if(operators.length>0){
    let subArray = [];
    let end = operators.length-1;
    if(index2<end){
      end = index2;
    }
    for(let x=index1; x<=end; x++){
      subArray[x] = operators[x];
    }
    pos = -1;
    pos = subArray.findIndex(element => {
          let regex = /\+|\-/;
          return (element.search(regex)>=0);
    });
    if(pos>=0){
      ans = operate(operators[pos], operands[pos], operands[pos+1]);
      operands.splice(pos, 2, ans);
      operators.splice(pos, 1);
      addOrSubtract(index1, index2);
    }
    else{
      return;
    }
  // }
  // else{
  //   return;
  // }
}

function equals(){
  betweenParenth(0, operators.length-1);
  console.log(`operators: ${operators}, operands: ${operands}`);
  //console.log(operands);
  // pos = -1;
  // pos = textArray.findIndex(element => {
  //      let regex = /\^/;
  //      return (element.search(regex)>=0);
  // });
  // if(pos>=0){

  // }
  // for(let x=0; x<operators.length; x++){

  // }
  // let curText = current.textContent;
  // let textArray = curText.split(" ");
  // let pos = textArray.findIndex(element => {
  //   let regex = /\*|\/|\-|\+|\^/g;
  //   return (element.search(regex)>=0);
  // });
  // operate(textArray[pos], Number(textArray[pos-1]), Number(textArray[pos+1]));
}

function updateOutput(newText){
  current.textContent += newText;
}

function operate(operator, num1, num2){
  // let newLine = current.textContent;
  switch(operator){
    case "^":
      return num1^num2;
    case "*":
      return num1*num2;
    case "/":
      return textContent = num1/num2;
    case "+":
      return num1+num2;
    case "-":
      return num1-num2;
    default:
      console.log("error on operator");
      return "error";
  }
  // newLine += " = "+current.textContent;
  // history.textContent = newLine+"\n"+history.textContent;
  // oldNumberPresent = true;
  // let newLine = current.textContent;
  // switch(operator){
  //   case "^":
  //     current.textContent = num1^num2;
  //     break;
  //   case "*":
  //     current.textContent = num1*num2;
  //     break;
  //   case "/":
  //     current.textContent = num1/num2;
  //     break;
  //   case "+":
  //     current.textContent = num1+num2;
  //     break;
  //   case "-":
  //     current.textContent = num1-num2;
  //     break;
  //   default:
  //     console.log("error on operator");
  // }
  // newLine += " = "+current.textContent;
  // history.textContent = newLine+"\n"+history.textContent;
  // oldNumberPresent = true;
}

function defineEquation(){
  let array = current.textContent.trimEnd().split(" ");
  let y = 0;
  let z = 0;
  for(let x=0; x<array.length; x++){
    let arrayPos = array[x];
    if(arrayPos.charAt(0)=="-"&&arrayPos.length>1){
      operands[y] = Number(arrayPos.substring(1))*(-1);
      y++;
    }
    else{
      let regexResult = arrayPos.search(/\*|\/|\-|\+|\^|\(|\)/g);
      if(regexResult>=0){
        operators[z]= arrayPos;
        z++;
      }
      else{
        operands[y] = Number(arrayPos.substring(0));
        y++;
      }
    }
  }
}