import { api } from '@/shared/api/api-client';
import type { FotoDto, PetCompletoDto, PetDto, PetRequestDto, PagedResponse } from '../pets.types';

export async function listPets(params: { page: number; size: number; nome?: string }) {
  const { data } = await api.get<PagedResponse<PetDto>>('/v1/pets', {
    params: {
      page: params.page,
      size: params.size,
      nome: params.nome || undefined,
      q: params.nome || undefined,
    },
  });
  return data;
}

export async function getPet(id: string) {
  const { data } = await api.get<PetCompletoDto>(`/v1/pets/${id}`);
  return data;
}

export async function createPet(payload: PetRequestDto) {
  const { data } = await api.post<PetDto>('/v1/pets', payload);
  return data;
}

export async function updatePet(id: string, payload: PetRequestDto) {
  const { data } = await api.put<PetDto>(`/v1/pets/${id}`, payload);
  return data;
}

export async function deletePet(id: string) {
  await api.delete(`/v1/pets/${id}`);
}

export async function uploadPetFoto(id: string, file: File) {
  const form = new FormData();
  form.append('foto', file);
  const { data } = await api.post<FotoDto>(`/v1/pets/${id}/fotos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
