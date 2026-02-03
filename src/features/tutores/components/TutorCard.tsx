import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import type { TutorDto } from '../tutores.types';
import { Badge, Card, CardContent } from '@/shared/components';

export function TutorCard({ tutor }: { tutor: TutorDto }) {
  const foto = tutor.foto?.url;

  return (
    <Link to={`/tutores/${tutor.id}`} className="block">
      <Card className="h-full overflow-hidden transition hover:shadow">
        <div className="aspect-[4/3] w-full bg-zinc-100">
          {foto ? (
            <img
              src={foto}
              alt={tutor.nome}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <User size={40} />
            </div>
          )}
        </div>
        <CardContent className="grid gap-2">
          <div className="truncate text-base font-semibold text-zinc-900">{tutor.nome}</div>
          <div className="flex flex-wrap gap-2">
            <Badge>{tutor.telefone ? `Telefone: ${tutor.telefone}` : 'Telefone: —'}</Badge>
            <Badge>{tutor.email ? `E-mail: ${tutor.email}` : 'E-mail: —'}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
