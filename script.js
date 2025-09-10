class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement){
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
    //Cache para formatação
    this.formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 20
    });
  }
  
  // Limpa a calculadora
  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operation = undefined;
    this.needsReset = false;
  }
  
  // Apaga um número
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }
  
  // Adiciona número
  appendNumber(number) {
    // Se precisar resetar (após o cálculo), limpa o display
    if (this.needsReset) {
      this.currentOperand = '';
      this.needsReset = false;
    }
    
    // Impedir digitação de múltiplos pontos '.'
    if (number === '.' && this.currentOperand.includes('.')) return;
    // Concatena sequência numérica atual com a nova
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }
  
  // Adiciona um operador
  choosenOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }
  
  // Calcula resultado
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const curr = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    switch (this.operation) {
      case '+':
        computation = prev + curr;
        break;
        
      case '-':
        computation = prev - curr;
        break;
        
      case '÷':
        computation = prev / curr;
        break;
        
      case '*':
        computation = prev * curr;
        break;
        
      default:
        return;
    }
    
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.needsReset = true;
  }
  
  // Formata sequência numérica
  formatNumber(number) {
    if (number === '') return '';
    const [integerPart, decimalpart] = number.toString().split('.');
    
    if (decimalpart !== undefined) {
      // Formata a parte inteira e mantém a decimal
      const formattedInteger = integerPart ? this.formatter.format(parseFloat(integerPart)) : '0';
      return `${formattedInteger}.${decimalpart}`;
    }
    
    return this.formatter.format(parseFloat(number));
  }
  
  // Atualiza a tela
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.formatNumber(this.currentOperand);
    
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// Elementos necessários
const calculatorGrid = document.querySelector('.calculatorGrid');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Objeto calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Evento de delegação
calculatorGrid.addEventListener('click', (e) => {
  if (!e.target.matches('button')) return;
  
  const button = e.target;
  
  if (button.hasAttribute('data-all-clear')) {
    calculator.clear();
    
  } else if (button.hasAttribute('data-delete')) {
    calculator.delete();
    
  } else if (button.hasAttribute('data-number')) {
    calculator.appendNumber(button.innerText);
    
  } else if (button.hasAttribute('data-operation')) {
    calculator.choosenOperation(button.innerText);
    
  } else if (button.hasAttribute('data-equals')) {
    calculator.compute();
  }
  
  calculator.updateDisplay();
});

// Suporte para teclado
document.addEventListener('keydown', (e) => {
  if (/[0-9.]/.test(e.key)) {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
    
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    calculator.choosenOperation(e.key === '/' ? '÷' : e.key);
    calculator.updateDisplay();
    
  } else if (e.key === 'Enter' || e.key === '=') {
    calculator.compute();
    calculator.updateDisplay();
    
  } else if (e.key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
    
  } else if (e.key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
});