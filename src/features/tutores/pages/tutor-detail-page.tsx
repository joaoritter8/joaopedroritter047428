import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2, Upload, User, Link2, Unlink2, Search, Dog } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input } from '@/shared/components';
import { useTutor, useDeleteTutor, useUploadTutorFoto, useLinkPet, useUnlinkPet } from '../api/tutores-hooks';
import { usePets } from '../../pets/api/pets-hooks';

const PAGE_SIZE = 10

export function TutorDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const tutorQ = useTutor(id)
  const del = useDeleteTutor()
  const upload = useUploadTutorFoto(id)
  const linkM = useLinkPet(id)
  const unlinkM = useUnlinkPet(id)

  const [file, setFile] = React.useState<File | null>(null)
  React.useEffect(() => {
    if (!file) return
    upload.mutate(file, { onSuccess: () => setFile(null) })
  }, [file, upload])

  async function onDelete() {
    if (!confirm('Excluir este tutor?')) return
    await del.mutateAsync(id)
    navigate('/tutores', { replace: true })
  }

  const [petSearch, setPetSearch] = React.useState('')
  const petsQ = usePets({ page: 0, size: PAGE_SIZE, nome: petSearch })

  const tutor = tutorQ.data

  return (
    <div className="grid gap-4">
      {tutorQ.isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">Carregando…</div>
      ) : tutorQ.isError ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">
          Erro ao carregar: {(tutorQ.error as Error).message}
        </div>
      ) : tutor ? (
        <>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{tutor.nome}</h1>
                <p className="mt-1 text-sm text-zinc-600">Tutor cadastrado no sistema</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => navigate(`/tutores/${tutor.id}/editar`)}>
                  <Edit size={16} />
                  Editar
                </Button>
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) setFile(f)
                    }}
                  />
                  <span className="inline-flex cursor-pointer">
                    <Button variant="secondary" type="button" disabled={upload.isPending}>
                      <Upload size={16} />
                      {upload.isPending ? 'Enviando…' : 'Enviar Foto'}
                    </Button>
                  </span>
                </label>
                <Button variant="danger" onClick={onDelete} disabled={del.isPending}>
                  <Trash2 size={16} />
                  Excluir
                </Button>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[320px_1fr]">
              <div className="rounded-2xl bg-zinc-100">
                {tutor.foto?.url ? (
                  <img src={tutor.foto.url} alt={tutor.nome} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-zinc-400">
                    <User size={54} />
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <InfoRow label="ID" value={tutor.id} />
                <InfoRow label="Nome" value={tutor.nome} highlight />
                <InfoRow label="Telefone" value={tutor.telefone ?? '—'} />
                <InfoRow label="Endereço" value={tutor.endereco ?? '—'} />
                <InfoRow label="E-mail" value={tutor.email ?? '—'} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Dog size={18} />
                <h2 className="text-base font-semibold text-zinc-900">Pets vinculados</h2>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {tutor.pets?.length ? (
                <div className="grid gap-2">
                  {tutor.pets.map((p) => (
                    <div key={p.id} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-zinc-900">{p.nome}</div>
                        <div className="text-xs text-zinc-600">{p.raca ? `Raça: ${p.raca}` : 'Espécie/Raça: —'} • {typeof p.idade === 'number' ? `Idade: ${p.idade}` : 'Idade: —'}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => navigate(`/pets/${p.id}`)}>
                          Ver pet
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => unlinkM.mutate(p.id)}
                          disabled={unlinkM.isPending}
                        >
                          <Unlink2 size={16} />
                          Desvincular
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-zinc-600">Nenhum pet vinculado.</div>
              )}

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Link2 size={16} />
                  <div className="text-sm font-semibold text-zinc-900">Vincular novo pet</div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-zinc-800">Buscar pet por nome</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 text-zinc-400" size={16} />
                    <Input className="pl-9" value={petSearch} onChange={(e) => setPetSearch(e.target.value)} placeholder="ex: Mel" />
                  </div>

                  {petsQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Buscando…</div>
                  ) : petsQ.data?.content?.length ? (
                    <div className="grid gap-2">
                      {petsQ.data.content.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white p-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-900">{p.nome}</div>
                            <div className="text-xs text-zinc-600">{p.raca ? p.raca : '—'}</div>
                          </div>
                          <Button
                            onClick={() => linkM.mutate(p.id)}
                            disabled={linkM.isPending}
                          >
                            <Link2 size={16} />
                            Vincular
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-600">Nenhum pet encontrado.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className={highlight ? 'mt-1 text-sm font-semibold text-zinc-900' : 'mt-1 text-sm text-zinc-800'}>
        {value}
      </div>
    </div>
  )
}
