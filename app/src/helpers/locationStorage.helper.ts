/**
 * Helper para gestión de ubicación en Local Storage y flujo de cambio de ciudad
 * ------------------------------------------------------------------------------
 * Provee funciones para persistir y recuperar la ciudad seleccionada en el
 * Local Storage del navegador, así como orquestar el flujo de actualización
 * de ciudad y recarga automática de la cartelera filtrada.
 */

export const STORAGE_KEY_CITY_ID = 'selected_city_id';
export const STORAGE_KEY_CITY_DATA = 'selected_city_data';

/**
 * Guarda el identificador y datos de la ciudad seleccionada en el Local Storage del navegador.
 */
export function saveLocationToLocalStorage(cityId: number | string, cityData?: any): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY_CITY_ID, String(cityId));
    if (cityData !== undefined) {
      window.localStorage.setItem(STORAGE_KEY_CITY_DATA, JSON.stringify(cityData));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene el ID de la ciudad guardada en el Local Storage del navegador.
 * Retorna null si no existe o no se encuentra en entorno de navegador.
 */
export function getLocationFromLocalStorage(): number | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CITY_ID);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed <= 0 ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Obtiene los datos completos de la ciudad guardada en el Local Storage si existen.
 */
export function getCityDataFromLocalStorage(): any | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CITY_DATA);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Elimina la ciudad guardada del Local Storage.
 */
export function clearLocationFromLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY_CITY_ID);
    window.localStorage.removeItem(STORAGE_KEY_CITY_DATA);
  } catch {
    // Ignorar errores en entornos restringidos
  }
}

export interface ChangeCityFlowResult {
  cityId: number;
  user?: any;
  catalog: any;
}

/**
 * Flujo completo para cambiar de ciudad:
 * 1. Actualiza la ubicación del usuario en la API.
 * 2. Guarda la nueva ubicación en el Local Storage.
 * 3. Vuelve a consultar automáticamente la cartelera filtrada por la nueva ciudad.
 */
export async function changeCityFlow(
  cityId: number,
  options: {
    apiBaseUrl?: string;
    fetchFn?: typeof fetch;
  } = {}
): Promise<ChangeCityFlowResult> {
  const fetchImpl = options.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  const baseUrl = options.apiBaseUrl || '';

  if (!fetchImpl) {
    saveLocationToLocalStorage(cityId);
    return { cityId, catalog: null };
  }

  // 1. Actualizar la ciudad en el servidor
  const locationResponse = await fetchImpl(`${baseUrl}/api/users/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityId }),
  });

  const locationData = await locationResponse.json();

  if (!locationResponse.ok) {
    throw new Error(locationData.error || locationData.message || 'Error al actualizar ubicación');
  }

  // 2. Guardar la nueva ubicación en el Local Storage
  saveLocationToLocalStorage(cityId, locationData.user || locationData.city);

  // 3. Si la respuesta ya incluye la cartelera actualizada, usarla; de lo contrario consultar cartelera
  let catalog = locationData.catalog;
  if (!catalog) {
    const catalogResponse = await fetchImpl(`${baseUrl}/api/movies/catalog/${cityId}`);
    catalog = await catalogResponse.json();
  }

  return {
    cityId,
    user: locationData.user,
    catalog,
  };
}
