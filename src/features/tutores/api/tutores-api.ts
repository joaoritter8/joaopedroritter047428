import { api } from '@/shared/api/api-client';
import type { PagedResponse, FotoDto } from '@/features/pets/pets.types';
import type { TutorDto, TutorRequestDto, TutorComPetsDto } from '../tutores.types'

export async function listTutores(params: { page: number; size: number; nome?: string }) {
  const { data } = await api.get<PagedResponse<TutorDto>>('/v1/tutores', {
    params: {
      page: params.page,
      size: params.size,
      nome: params.nome || undefined,
      q: params.nome || undefined,
    },
  })
  return data
}

export async function getTutor(id: string) {
  const { data } = await api.get<TutorComPetsDto>(`/v1/tutores/${id}`)
  return data
}

export async function createTutor(payload: TutorRequestDto) {
  const { data } = await api.post<TutorDto>('/v1/tutores', payload)
  return data
}

export async function updateTutor(id: string, payload: TutorRequestDto) {
  const { data } = await api.put<TutorDto>(`/v1/tutores/${id}`, payload)
  return data
}

export async function deleteTutor(id: string) {
  await api.delete(`/v1/tutores/${id}`)
}

export async function uploadTutorFoto(id: string, file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<FotoDto>(`/v1/tutores/${id}/fotos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function linkPet(tutorId: string, petId: string) {
  await api.post(`/v1/tutores/${tutorId}/pets/${petId}`)
}

export async function unlinkPet(tutorId: string, petId: string) {
  await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`)
}
