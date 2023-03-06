class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }
  
  clear() {
    this.previousOperand = "";
    this.currentOperand = "";
    this.operation = undefined;
  }
  
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }
  
  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return
    
    this.currentOperand = this.currentOperand.toString() + number;
  }
  
  chooseOperation(operation) {
    if (this.currentOperand === "") return
    if (this.previousOperand !== "") {
      compute();
    }
    
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.operation = operation;
  }
  
  compute() {
    let computation;
    
    const prev = parseFloat(this.previousOperand);
    const curr = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(curr)) return
    
    switch (this.operation) {
      case "+": computation = prev + curr; break;
      case "-": computation = prev - curr; break;
      case "÷": computation = prev / curr; break;
      case "*": computation = prev * curr; break;
      default: return
    }
    this.currentOperand = computation;
    this.previousOperand = "";
    this.operation = undefined;
  }
  
  getNumberDisplay(number) {
    const stringNumber = number.toString();
    
    // Pega valor antes do "."
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    
    // Pega valor após "."
    const decimalDigits = stringNumber.split(".")[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {maximumFractionDigits: 0});
    }
    
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
  
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getNumberDisplay(this.currentOperand);
    
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getNumberDisplay(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
  
}

const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");
const buttonAllClear = document.querySelector("[data-all-clear]");
const buttonDelete = document.querySelector("[data-delete]");
const buttonEquals = document.querySelector("[data-equals]");
const buttonsOperation = document.querySelectorAll("[data-operation]");
const buttonsNumber = document.querySelectorAll("[data-number]");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

buttonAllClear.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

buttonDelete.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

buttonsNumber.forEach(button => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

buttonsOperation.forEach(button => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

buttonEquals.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});