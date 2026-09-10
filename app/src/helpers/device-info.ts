import type { Request } from 'express';

/**
 * Extrae la dirección IP del cliente desde la solicitud HTTP.
 * Considera encabezados de proxy inverso (x-forwarded-for) y la IP directa.
 */
export function getClientIp(req: Request): string | null {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

/**
 * Extrae información del dispositivo/navegador desde el encabezado User-Agent.
 * Devuelve una representación legible del dispositivo.
 */
export function getDeviceInfo(req: Request): string | null {
  const userAgent = req.headers['user-agent'];
  if (!userAgent || typeof userAgent !== 'string') return null;

  // Detección simple basada en el User-Agent
  const ua = userAgent.toLowerCase();

  let deviceType = 'Unknown';
  if (/mobile|android|iphone|ipad|ipod|windows phone/.test(ua)) {
    deviceType = 'Mobile';
  } else if (/tablet|ipad/.test(ua)) {
    deviceType = 'Tablet';
  } else {
    deviceType = 'Desktop';
  }

  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
  } else if (ua.includes('opr')) {
    browser = 'Opera';
  }

  let os = 'Unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os')) {
    os = 'macOS';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  return `${deviceType} - ${browser} - ${os}`;
}

/**
 * Extrae el User-Agent completo de la solicitud.
 */
export function getUserAgent(req: Request): string | null {
  const userAgent = req.headers['user-agent'];
  if (!userAgent || typeof userAgent !== 'string') return null;
  return userAgent;
}
