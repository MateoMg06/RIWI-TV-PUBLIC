import crypto from 'crypto';

export interface CaptchaChallenge {
  token: string;
  question: string;
  answer: number;
}

export function generateCaptcha(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `¿Cuánto es ${num1} + ${num2}?`;
      break;
    case '-':
      answer = num1 - num2;
      question = `¿Cuánto es ${num1} - ${num2}?`;
      break;
    case '*':
      answer = num1 * num2;
      question = `¿Cuánto es ${num1} × ${num2}?`;
      break;
    default:
      answer = num1 + num2;
      question = `¿Cuánto es ${num1} + ${num2}?`;
  }

  const token = crypto.randomBytes(32).toString('hex');

  return {
    token,
    question,
    answer,
  };
}

export function verifyCaptcha(token: string, userAnswer: number): boolean {
  // Aquí asumimos que el frontend envía el token y la respuesta y validamos que la respuesta sea un número
  return typeof userAnswer === 'number' && !isNaN(userAnswer);
}
