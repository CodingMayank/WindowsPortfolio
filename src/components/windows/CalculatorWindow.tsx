import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function CalculatorWindow() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operator) {
        case '+': result = currentValue + inputValue; break;
        case '-': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = inputValue !== 0 ? currentValue / inputValue : 0; break;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    if (!operator || previousValue === null) return;
    
    const inputValue = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+': result = previousValue + inputValue; break;
      case '-': result = previousValue - inputValue; break;
      case '×': result = previousValue * inputValue; break;
      case '÷': result = inputValue !== 0 ? previousValue / inputValue : 0; break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleClick = (btn: string) => {
    if (btn >= '0' && btn <= '9') inputDigit(btn);
    else if (btn === '.') inputDecimal();
    else if (btn === 'C') clear();
    else if (btn === '=') calculate();
    else if (['+', '-', '×', '÷'].includes(btn)) performOperation(btn);
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Display */}
      <div className="bg-muted rounded-lg p-4 text-right">
        <span className="text-3xl font-light text-foreground">{display}</span>
      </div>

      {/* Buttons */}
      <div className="grid gap-1">
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-1">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={cn(
                  'py-3 rounded-lg font-medium transition-all duration-150',
                  'active:scale-95 hover:brightness-110',
                  btn === '0' ? 'col-span-2' : '',
                  ['÷', '×', '-', '+', '='].includes(btn)
                    ? 'bg-primary text-primary-foreground'
                    : ['C', '±', '%'].includes(btn)
                    ? 'bg-muted text-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
