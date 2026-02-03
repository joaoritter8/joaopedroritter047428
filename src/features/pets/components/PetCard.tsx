import { Link } from 'react-router-dom';
import { Dog } from 'lucide-react';
import type { PetDto } from '../pets.types';
import { Badge, Card, CardContent } from '@/shared/components';

export function PetCard({ pet }: { pet: PetDto }) {
  const foto = pet.foto?.url;

  return (
    <Link to={`/pets/${pet.id}`} className="block">
      <Card className="h-full overflow-hidden transition hover:shadow">
        <div className="aspect-[4/3] w-full bg-zinc-100">
          {foto ? (
            <img src={foto} alt={pet.nome} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <Dog size={40} />
            </div>
          )}
        </div>
        <CardContent className="grid gap-2">
          <div className="truncate text-base font-semibold text-zinc-900">{pet.nome}</div>
          <div className="flex flex-wrap gap-2">
            <Badge>{pet.raca ? `Espécie/Raça: ${pet.raca}` : 'Espécie/Raça: —'}</Badge>
            <Badge>{typeof pet.idade === 'number' ? `Idade: ${pet.idade}` : 'Idade: —'}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
