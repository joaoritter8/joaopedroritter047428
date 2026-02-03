import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dog, Edit, Trash2, User } from 'lucide-react';
import { Button, Card, CardHeader } from '@/shared/components';
import { usePet, useDeletePet, useUploadPetFoto } from '../api/pets-hooks';

export function PetDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: pet, isLoading, isError, error } = usePet(id)


  const del = useDeletePet()
  const upload = useUploadPetFoto(id)

  async function onDelete() {
    if (!confirm('Excluir este pet?')) return
    await del.mutateAsync(id)
    navigate('/', { replace: true })
  }

  const [file, setFile] = React.useState<File | null>(null)
  React.useEffect(() => {
    if (!file) return
    upload.mutate(file, {
      onSuccess: () => setFile(null),
    })
  }, [file, upload])

  return (
    <div className="grid gap-4">
      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">Carregando…</div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">
          Erro ao carregar: {(error as Error).message}
        </div>
      ) : pet ? (
        <>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{pet.nome}</h1>
                <p className="mt-1 text-sm text-zinc-600">
                  {pet.raca ? `Raça: ${pet.raca}` : 'Espécie/Raça: —'} •{' '}
                  {typeof pet.idade === 'number' ? `Idade: ${pet.idade}` : 'Idade: —'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => navigate(`/pets/${pet.id}/editar`)}>
                  <Edit size={16} />
                  Editar
                </Button>
                
                <Button variant="danger" onClick={onDelete} disabled={del.isPending}>
                  <Trash2 size={16} />
                  Excluir
                </Button>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[320px_1fr]">
              <div className="rounded-2xl bg-zinc-100">
                {pet.foto?.url ? (
                  <img src={pet.foto.url} alt={pet.nome} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-zinc-400">
                    <Dog size={54} />
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <InfoRow label="ID" value={pet.id} />
                <InfoRow label="Nome" value={pet.nome} highlight />
                <InfoRow label="Espécie/Raça" value={pet.raca ?? '—'} />
                <InfoRow label="Idade" value={typeof pet.idade === 'number' ? String(pet.idade) : '—'} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} />
                <h2 className="text-base font-semibold text-zinc-900">Tutor</h2>
              </div>
            </CardHeader>
            
          </Card>
        </>
      ) : null}
    </div>
  )
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className={highlight ? 'mt-1 text-sm font-semibold text-zinc-900' : 'mt-1 text-sm text-zinc-800'}>
        {value}
      </div>
    </div>
  )
}
