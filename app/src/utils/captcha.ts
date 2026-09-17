import crypto from 'crypto';

export interface CaptchaChallenge {
  token: string;
  question: string;
  answer: number;
}

interface CaptchaPayload {
  answer: number;
  expiresAt: number;
  nonce: string;
}

const CAPTCHA_TTL_MS = 5 * 60 * 1000;

function getCaptchaSecret(): string {
  const secret = process.env.CAPTCHA_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('CAPTCHA_SECRET o JWT_SECRET debe estar configurado');
  }
  return secret;
}

function sign(encodedPayload: string): string {
  return crypto.createHmac('sha256', getCaptchaSecret()).update(encodedPayload).digest('base64url');
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

  const payload: CaptchaPayload = {
    answer,
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(encodedPayload);

  return { token: `${encodedPayload}.${signature}`, question, answer };
}

export function verifyCaptcha(token: string, userAnswer: number): boolean {
  try {
    if (typeof token !== 'string' || !Number.isFinite(userAnswer)) return false;
    const [encodedPayload, providedSignature, extra] = token.split('.');
    if (!encodedPayload || !providedSignature || extra) return false;

    const expectedSignature = sign(encodedPayload);
    const providedBuffer = Buffer.from(providedSignature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as CaptchaPayload;
    if (!Number.isFinite(payload.answer) || !Number.isFinite(payload.expiresAt)) return false;
    if (Date.now() > payload.expiresAt) return false;
    return payload.answer === userAnswer;
  } catch {
    return false;
  }
}

// Se conserva por compatibilidad con imports existentes. El CAPTCHA ahora es
// stateless y firmado, por lo que no necesita limpieza de memoria.
export function cleanExpiredCaptchas(): void {}
