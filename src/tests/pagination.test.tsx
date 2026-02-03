import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/shared/components';
import { expect, test, vi } from 'vitest';

test('desabilita anterior na primeira página e chama onPageChange no próximo', async () => {
  const user = userEvent.setup()
  const onPageChange = vi.fn()

  render(<Pagination page={0} pageCount={3} onPageChange={onPageChange} />)

  expect(screen.getByRole('button', { name: /Anterior/i })).toBeDisabled()

  await user.click(screen.getByRole('button', { name: /Próxima/i }))
  expect(onPageChange).toHaveBeenCalledWith(1)
});
