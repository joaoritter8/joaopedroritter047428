import type { FotoDto, PetDto } from '@/features/pets/pets.types';

export type TutorDto = {
  id: string
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: number
  foto?: FotoDto
}

export type TutorComPetsDto = TutorDto & {
  pets?: PetDto[]
}

export type TutorRequestDto = {
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: number
}