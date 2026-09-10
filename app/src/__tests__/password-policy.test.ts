import { validatePassword } from '../utils/password';

describe('política de contraseña HU-006', () => {
  it('exige longitud, mayúscula, minúscula, número y símbolo', async () => {
    await expect(validatePassword('ClaveSegura1!')).resolves.toBe(true);
    await expect(validatePassword('corta1!')).resolves.toBe(false);
    await expect(validatePassword('clavesegura1!')).resolves.toBe(false);
    await expect(validatePassword('CLAVESEGURA1!')).resolves.toBe(false);
    await expect(validatePassword('ClaveSegura!!')).resolves.toBe(false);
  });
});
