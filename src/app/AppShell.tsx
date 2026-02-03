import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Dog, Home, Users, LogOut, PawPrint } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components';
import { useAuth } from '@/features/auth/auth-context';

export function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow">
              <PawPrint size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">Pets MT</div>
              <div className="text-xs text-zinc-500">
                Registro público de pets e tutores do estado de Mato Grosso
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.username ? (
              <div className="hidden text-sm text-zinc-600 sm:block">Olá, {user.username}</div>
            ) : null}
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
            <NavItem to="/" icon={<Home size={18} />} label="Pets" end />
            <NavItem to="/tutores" icon={<Users size={18} />} label="Tutores" />
            <div className="my-2 border-t border-zinc-100" />
            <div className="grid gap-2 p-2">
              <Button variant="secondary" onClick={() => navigate('/pets/novo')}>
                <Dog size={16} />
                Novo Pet
              </Button>
              <Button variant="secondary" onClick={() => navigate('/tutores/novo')}>
                <Users size={16} />
                Novo Tutor
              </Button>
            </div>
          </aside>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100',
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
