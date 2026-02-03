import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetCard } from '@/features/pets/components/PetCard';
import { expect, test } from 'vitest';

test('renderiza o card do pet com nome e idade', () => {
  render(
    <MemoryRouter>
      <PetCard pet={{ id: '1', nome: 'Mel', idade: 3, raca: 'Labrador' }} />
    </MemoryRouter>,
  )

  expect(screen.getByText('Mel')).toBeInTheDocument()
  expect(screen.getByText(/Idade: 3/)).toBeInTheDocument()
  expect(screen.getByText(/Labrador/)).toBeInTheDocument()
});
