import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, Input } from '@/shared/components'
import { useCreatePet, usePet, useUpdatePet, useUploadPetFoto } from '../api/pets-hooks'

const schema = z.object({
  nome: z.string().min(1, 'Informe o nome').max(100,
    'Máximo 100 caracteres'),
  raca: z.string().max(100, 'Máximo 100 caracteres').optional().or(z.literal('')),
  idade: z
    .union([z.coerce.number().int().nonnegative(), z.nan()])
    .transform((v) => (Number.isNaN(v as number) ? undefined : v))
    .optional(),
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

export function PetFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const petQuery = usePet(id ?? '')
  const create = useCreatePet()
  const update = useUpdatePet(id ?? '')
  const upload = useUploadPetFoto(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', raca: '', idade: undefined },
  })

  React.useEffect(() => {
    if (isEdit && petQuery.data) {
      reset({
        nome: petQuery.data.nome,
        raca: petQuery.data.raca ?? '',
        idade: petQuery.data.idade ?? undefined,
      })
    }
  }, [isEdit, petQuery.data, reset])

  const [file, setFile] = React.useState<File | null>(null)

  async function onSubmit(values: FormOutput) {
    if (isEdit && id) {
      await update.mutateAsync({ nome: values.nome, raca: values.raca || undefined, idade: values.idade })
      if (file) await upload.mutateAsync(file)
      navigate(`/pets/${id}`, { replace: true })
      return
    }

    const created = await create.mutateAsync({ nome: values.nome, raca: values.raca || undefined, idade: values.idade })
    if (file) await uploadPetAfterCreate(created.id, file)
    navigate(`/pets/${created.id}`, { replace: true })
  }

  async function uploadPetAfterCreate(petId: string, f: File) {
    // para upload, usamos o mesmo hook (mas precisa do ID) - instância ad-hoc
    const { uploadPetFoto } = await import('../api/pets-api')
    await uploadPetFoto(petId, f)
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">{isEdit ? 'Editar Pet' : 'Novo Pet'}</h1>
            <p className="text-sm text-zinc-600">Campos: nome, raça, idade. Upload opcional de foto.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Nome</label>
              <Input placeholder="ex: Mel" {...register('nome')} />
              {errors.nome ? <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Espécie / Raça</label>
              <Input placeholder="ex: Labrador" {...register('raca')} />
              {errors.raca ? <p className="mt-1 text-xs text-red-600">{errors.raca.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Idade</label>
              <Input type="number" min={0} placeholder="ex: 3" {...register('idade')} />
              {errors.idade ? <p className="mt-1 text-xs text-red-600">{errors.idade.message as string}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Foto (opcional)</label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                <div className="text-xs text-zinc-500">PNG/JPG.</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isSubmitting || create.isPending || update.isPending}>
                <Save size={16} />
                {isSubmitting ? 'Salvando…' : 'Salvar'}
              </Button>
              {isEdit && id ? (
                <Button type="button" variant="secondary" onClick={() => navigate(`/pets/${id}`)}>
                  Cancelar
                </Button>
              ) : (
                <Button type="button" variant="secondary" onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
              )}
            </div>

            {file ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Upload size={14} />
                  Foto selecionada: <span className="font-medium">{file.name}</span>
                </div>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
