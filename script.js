const calcButtons = document.querySelectorAll(".buttons-container button");
const backButton = document.querySelector("#backspace");
const currButton = document.querySelector("#current-button")
const allButton = document.querySelector("#all-button");;
const current = document.querySelector("#output-current");
const history = document.querySelector("#output-history");

// function operation(num1, num2, oper){
//   this.num1 = num1;
//   this.num2 =num2;
//   this.oper = oper;
//   this.solve = function(){
//     return operate(oper, num1, num2);
//   }
// };

let equation = [];

// let operands = [];
// let operators = [];
// let indexStart=0;
// let indexEnd=0;
let currentOperand = "";
let needsOperand = true;
let needsOperandNext = false;
let oldNumberPresent = false;
let currentDecimal = false;
let currentNegative = false;
let numOpenParenth = 0;

backButton.addEventListener("click", function(e){

})

currButton.addEventListener("click", function(e){
  current.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  currentDecimal = false;
  currentNegative = false;
  numOpenParenth = 0;
})

allButton.addEventListener("click", function(e){
  current.textContent = "";
  history.textContent = "";
  needsOperand = true;
  needsOperandNext = false;
  oldNumberPresent = false;
  currentDecimal = false;
  currentNegative = false;
  numOpenParenth = 0;
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
      }
      else if(buttonText==="="){
        operands = [];
        operators = [];
        defineEquation();
        // console.log(`Starting rands: ${operands}, starting rators: ${operators}`);
        //console.log(pairParenth(operators));
        equals();
      }
      else if(buttonText===")"){
        if(numOpenParenth>0){
          textToAdd = ")";
          numOpenParenth--;
        }
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

// function addParenth(input){
//   if(input.length>0){
//     return "("+input + ")";
//   } 
// }

// function removeOperator(){
//   let curText = current.textContent.trim();
//   if(curText.indexOf("(")==0){
//     current.textContent = curText.substring(1, curText.length-2);
//   }
//   else{
//     let index = curText.lastIndexOf(" ");//last whitespace will be before operand
//     if(index>0){
//       current.textContent = curText.substring(0, index);
//     }
//   }
// }

function removeOperator(){
  let curText = current.textContent.trim();
  curText = curText.substring(0, curText.length-1);
  if(curText.lastIndexOf(" ")==curText.length-2){
    curText += " ";
  }
  current.textContent = curText;
}

// function changePosNeg(){
//   let curText = current.textContent;
//   if(curText.length == 0){
//     curText = "-";
//   }
//   else{
//     if(curText.charAt(0)==='-'){
//       current.textContent = curText.substring(1);
//     }
//     else{
//       current.textContent = "-"+curText.trim();
//     }
//   }
// }

function makeDecimal(){

}

// function pairParenth(array){
//   let starts = [];
//   let pairs = [];
//   for(let x=0; x<array.length; x++){
//     if(array[x] == "("){
//       starts.push(x);
//     }
//     if(array[x] == ")"){
//       pairs.push([starts.pop(), x]);
//     }
//   }
//   return pairs;
// }

// function calcParenth(pairs){
//   for(let x=0; x<pairs.length; x++){
//     let index1 = pairs[x][0];
//     let index2 = pairs[x][1];
//     doCalc(index1+1, index2-1);
//   //   operators.splice(pairs[x][0], 1);
//   //   operators.splice(pairs[x][1]-1, 1);
//   //   pairs[x][1]--;
//   // }
//   // pairs.forEach(pair => function(){ 
//   }
// }

// function doCalc(index1, index2){
//   let firstNum = equation[index1];
//   let secNum = equation[index2];
//   operate(operands[0], firstNum, secNum);
// }

// function betweenParenth(index1, index2){
//   let subArray = [];
//   let spliceMod = 0;
//   for(let x=index1; x<=index2; x++){
//     subArray[x] = operators[x];
//   }
//   let endParenth = subArray.indexOf(")", index1);
//   let startParenth = subArray.lastIndexOf("(", endParenth); //breaks on 
//   //nested (, stable most other cases
//   // if(startParenth == -1&&endParenth==-1){
//   //   expo(index1, index2);
//   // }
//   // else{
//   //   betweenParenth(startParenth+1, endParenth-1);
//   // }
//   // let startParenth = subArray.indexOf("(", index1);
//   // let endParenth = subArray.lastIndexOf(")", index2);
//   // console.log(`looking between: ${startParenth} and ${endParenth} for indices ${index1}-${index2} in ${subArray}; ${operands} | ${operators}`);
//   if(startParenth>=0&&endParenth>=0){
//     // operands.splice(index1, 0, "");
//     // operands.splice(index2-1, 0, "");
//     // betweenParenth(startParenth+1, endParenth-1);
//     operators.splice(startParenth, 1);
//     operators.splice(endParenth-1, 1);
//     spliceMod += 2;
//     betweenParenth(startParenth, endParenth-spliceMod);//check for nested ()
//     betweenParenth(index1, index2-spliceMod);//check for other () remaining
//   }
//   // console.log(`eval: ${index1} and ${index2-spliceMod}; ${operands} | ${operators}`);
//   expo(index1, index2-spliceMod);
// }

// function expo(index1, index2){
//     let subArray = [];
//     let end = operators.length-1;
//     let spliceMod = 0;
//     if(index2<end){
//       end = index2;
//     }
//     for(let x=index1; x<=end; x++){
//       subArray[x] = operators[x];
//     }
//     pos = -1;
//     pos = subArray.findIndex(element => {
//           let regex = /\^/;
//           return (element!=null&&(element.search(regex)>=0));
//     });
//     if(pos>=0){
//       // console.log(`Pos: ${pos-2}, Operand1: ${operands[pos-2]}, Operand2: ${operands[pos-1]}`);
//       ans = operate(operators[pos], operands[pos], operands[pos+1]);
//       operands.splice(pos, 2, ans);
//       // operands.splice(pos, 0, "");
//       operators.splice(pos, 1);
//       spliceMod++;
//       expo(index1, index2-spliceMod);
//       //maybe instead of all the splicing shenanigans I just remove parenths once the internal stuff is done
//     }
//     multiplyOrDivide(index1, index2-spliceMod);
// }


// function multiplyOrDivide(index1, index2){
//   // console.log(`operators: ${operators}, operands: ${operands}`);
//   // if(operators.length>0){
//     let subArray = [];
//     let spliceMod = 0;
//     let end = operators.length-1;
//     if(index2<end){
//       end = index2;
//     }
//     for(let x=index1; x<=end; x++){
//       subArray[x] = operators[x];
//     }
//     pos = -1;
//     pos = subArray.findIndex(element => {
//           let regex = /\*|\//;
//           return (element!=null&&(element.search(regex)>=0));
//     });
//     if(pos>=0){
//       // ans = operate(operators[pos], operands[pos], operands[pos-1]);
//       ans = operate(operators[pos], operands[pos], operands[pos+1]);
//       operands.splice(pos, 2, ans);
//       operators.splice(pos, 1);
//       spliceMod++;
//       multiplyOrDivide(index1, index2-spliceMod);
//     }
//     addOrSubtract(index1, index2-spliceMod);
//   // }
// }

// function addOrSubtract(index1, index2){
//   //console.log(`operators: ${operators}, operands: ${operands}`);
//   // if(operators.length>0){
//     let subArray = [];
//     let spliceMod = 0;
//     let end = operators.length-1;
//     if(index2<end){
//       end = index2;
//     }
//     for(let x=index1; x<=end; x++){
//       subArray[x] = operators[x];
//     }
//     pos = -1;
//     pos = subArray.findIndex(element => {
//           let regex = /\+|\-/;
//           return (element!=null&&(element.search(regex)>=0));
//     });
//     // console.log(`between: ${index1} and ${index2}; ${operands} ${operators}`);
//     if(pos>=0){
//       // ans = operate(operators[pos], operands[pos], operands[pos-1]);
//       ans = operate(operators[pos], operands[pos], operands[pos+1]);
//       operands.splice(pos, 2, ans);
//       operators.splice(pos, 1);
//       spliceMod++;
//       addOrSubtract(index1, index2-spliceMod);
//     }
//   // }
//   // else{
//   //   return;
//   // }
// }

// function equals(){
//   let interrim = history.textContent;
//   betweenParenth(0, operators.length-1); //initial try
//   //calcParenth(pairParenth(equation));
//   // console.log(`Ending rands: ${operands}, ending rators: ${operators}`);
//   let finalIndex = operands.findIndex(element => element!=null&&""+element>0);
//   // console.log("finalIndex: "+finalIndex);
//   if(operands.length==0){
//     history.textContent = current.textContent+" = "+"Error"+"\n"+ interrim;
//     current.textContent = "";
//   }
//   else{
//     history.textContent = current.textContent+" = "+operands[finalIndex]+"\n"+ interrim;
//     current.textContent = operands[finalIndex];
//     oldNumberPresent = true;
//   }
//   // history.textContent = current.textContent+" = "+operands[1]+"\n"+ interrim;
//   // current.textContent = operands[1];
//   // console.log(`operators: ${operators}, operands: ${operands}`);
//   //console.log(operands);
//   // pos = -1;
//   // pos = textArray.findIndex(element => {
//   //      let regex = /\^/;
//   //      return (element.search(regex)>=0);
//   // });
//   // if(pos>=0){

//   // }
//   // for(let x=0; x<operators.length; x++){

//   // }
//   // let curText = current.textContent;
//   // let textArray = curText.split(" ");
//   // let pos = textArray.findIndex(element => {
//   //   let regex = /\*|\/|\-|\+|\^/g;
//   //   return (element.search(regex)>=0);
//   // });
//   // operate(textArray[pos], Number(textArray[pos-1]), Number(textArray[pos+1]));
//   equation.splice(0, 0, "(");
//   equation.push(")");
//   console.log(equation);
//   betterCalc();
//   console.log(equation);
// }

function updateOutput(newText){
  current.textContent += newText;
}

function operate(operator, num1, num2){
  // let newLine = current.textContent;
  switch(operator){
    case "^":
      return Math.pow(num1,num2);
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

// function defineEquation(){
//   let array = current.textContent.trimEnd().split(/\s|(\()|(\))|(\^)/).filter(el => el!=null&&el.length>0);
//   equation = array;
//   let y = 0;
//   let z = 0;
//   for(let x=0; x<array.length; x++){
//     let arrayPos = array[x];
//     if(arrayPos.charAt(0)=="-"&&arrayPos.length>1){
//       operands[y] = Number(arrayPos.substring(1))*(-1);
//       y++;
//     }
//     else{
//       let regexResult = arrayPos.search(/\*|\/|\-|\+|\^|\(|\)/g);
//       if(regexResult>=0){
//         operators[z]= arrayPos;
//         z++;
//       }
//       else{
//         operands[y] = Number(arrayPos.substring(0));
//         y++;
//       }
//     }
//   }
//   for(let x=numOpenParenth; x>0; x--){
//     operators.push(")");
//   }
// }

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
  let interrim = history.textContent;
  equation.splice(0, 0, "(");
  equation.push(")");
  console.log(equation);
  betterCalc();
  console.log(equation);
  let finalIndex = equation.findIndex(element => element!=null&&""+element>0);
  if(equation.length==0){
    history.textContent = current.textContent+" = "+"Error"+"\n"+ interrim;
    current.textContent = "";
  }
  else{
    history.textContent = current.textContent+" = "+equation[finalIndex]+"\n"+ interrim;
    current.textContent = equation[finalIndex];
    oldNumberPresent = true;
  }
}
