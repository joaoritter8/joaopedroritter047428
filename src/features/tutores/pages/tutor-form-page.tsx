import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useHookFormMask } from 'use-mask-input'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, Input } from '@/shared/components'
import { useCreateTutor, useTutor, useUpdateTutor } from '../api/tutores-hooks'

const schema = z.object({
  nome: z.string().min(1, 'Informe o nome completo').max(150, 'Máximo 150 caracteres'),
  telefone: z.string().optional().or(z.literal('')),
  endereco: z.string().optional().or(z.literal('')),
  email: z.email('E-mail inválido').optional().or(z.literal('')),
  cpf: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => {
      const digits = (v || '').replace(/\D/g, '')
      return digits.length === 0 || digits.length === 11
    }, 'CPF inválido'),
})

type FormValues = z.infer<typeof schema>

export function TutorFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const tutorQ = useTutor(id ?? '')
  const create = useCreateTutor()
  const update = useUpdateTutor(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', telefone: '', endereco: '', email: '', cpf: '' },
  });
  const registerWithMask = useHookFormMask(register)


  React.useEffect(() => {
    if (isEdit && tutorQ.data) {
      reset({
        nome: tutorQ.data.nome,
        telefone: tutorQ.data.telefone ?? '',
        endereco: tutorQ.data.endereco ?? '',
        email: tutorQ.data.email ?? '',
        cpf: tutorQ.data.cpf ? String(tutorQ.data.cpf) : '',
      })
    }
  }, [isEdit, reset, tutorQ.data])

  const [file, setFile] = React.useState<File | null>(null)

  async function onSubmit(values: FormValues) {
    const cpfDigits = (values.cpf || '').replace(/\D/g, '')
    const cpfNumber = cpfDigits ? Number(cpfDigits) : undefined

    const payload = {
      nome: values.nome,
      telefone: values.telefone || undefined,
      endereco: values.endereco || undefined,
      email: values.email || undefined,
      cpf: cpfNumber,
    }

    if (isEdit && id) {
      await update.mutateAsync(payload)
      if (file) await uploadTutorAfterSave(id, file)
      navigate(`/tutores/${id}`, { replace: true })
      return
    }

    const created = await create.mutateAsync(payload)
    if (file) await uploadTutorAfterSave(created.id, file)
    navigate(`/tutores/${created.id}`, { replace: true })
  }

  async function uploadTutorAfterSave(tutorId: string, f: File) {
    const { uploadTutorFoto } = await import('../api/tutores-api')
    await uploadTutorFoto(tutorId, f)
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">{isEdit ? 'Editar Tutor' : 'Novo Tutor'}</h1>
            <p className="text-sm text-zinc-600">Campos: nome completo, telefone, endereço. Upload opcional de foto.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Nome completo</label>
              <Input placeholder="ex: Maria da Silva" {...register('nome')} />
              {errors.nome ? <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Telefone</label>
              <Input
                placeholder="(65) 99999-9999"
                {...registerWithMask('telefone', ['(99) 99999-9999'])}
              />
              {errors.telefone ? <p className="mt-1 text-xs text-red-600">{errors.telefone.message as string}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Endereço</label>
              <Input placeholder="Rua, número, bairro, cidade" {...register('endereco')} />
              {errors.endereco ? <p className="mt-1 text-xs text-red-600">{errors.endereco.message as string}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">E-mail (opcional)</label>
                <Input placeholder="maria@email.com" {...register('email')} />
                {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">CPF (opcional)</label>
                <Input placeholder="000.000.000-00" {...registerWithMask('cpf', ['999.999.999-99'])} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Foto (opcional)</label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isSubmitting || create.isPending || update.isPending}>
                <Save size={16} />
                {isSubmitting ? 'Salvando…' : 'Salvar'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(isEdit && id ? `/tutores/${id}` : '/tutores')}>
                Cancelar
              </Button>
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
