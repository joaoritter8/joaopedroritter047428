import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent, Input, Pagination } from '@/shared/components';
import { PetCard } from '../components/PetCard';
import { usePets } from '../api/pets-hooks';

const PAGE_SIZE = 10;

export function PetsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '0');
  const nome = searchParams.get('nome') ?? '';

  // debounce simples
  const [draft, setDraft] = React.useState(nome);
  React.useEffect(() => setDraft(nome), [nome]);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (draft) next.set('nome', draft);
      else next.delete('nome');
      next.set('page', '0');
      setSearchParams(next);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const { data, isLoading, isError, error } = usePets({ page, size: PAGE_SIZE, nome });

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Pets</h1>
            <p className="text-sm text-zinc-600">
              Listagem paginada de pets (10 por página) com busca por nome.
            </p>
          </div>

          <div className="w-full sm:max-w-sm">
            <label className="mb-1 block text-sm font-medium text-zinc-800">Buscar por nome</label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-2.5 text-zinc-400"
                size={16}
              />
              <Input
                className="pl-9"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="ex: Mel"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          Carregando…
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">
          Erro ao carregar: {(error as Error).message}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              onPageChange={(next) => {
                const sp = new URLSearchParams(searchParams);
                sp.set('page', String(next));
                setSearchParams(sp);
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
