import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { PawPrint, LogIn } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@/shared/components';
import { useAuth } from '@/features/auth/auth-context';

const schema = z.object({
  username: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: 'admin', password: 'admin' },
  });

  async function onSubmit(values: FormValues) {
    await login(values.username, values.password);
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-50 to-white px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
            <PawPrint size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900">Pets MT</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Acesse para gerenciar pets e tutores do estado de Mato Grosso
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">Usuário</label>
                <Input placeholder="ex: admin" {...register('username')} />
                {errors.username ? (
                  <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">Senha</label>
                <Input type="password" placeholder="••••••" {...register('password')} />
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                ) : null}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                <LogIn size={16} />
                {isSubmitting ? 'Entrando…' : 'Entrar'}
              </Button>

              <p className="text-xs text-zinc-500">
                Dica: <span className="font-mono">admin/admin</span>.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
