import { expect, test } from 'vitest';
import { clearTokens, loadTokens, saveTokens } from '@/features/auth/storage';

test('salva e carrega tokens do localStorage', () => {
  clearTokens()

  saveTokens({
    accessToken: 'a',
    refreshToken: 'r',
    accessExpiresAt: 123,
    refreshExpiresAt: 456,
  })

  expect(loadTokens()).toEqual({
    accessToken: 'a',
    refreshToken: 'r',
    accessExpiresAt: 123,
    refreshExpiresAt: 456,
  })
});
