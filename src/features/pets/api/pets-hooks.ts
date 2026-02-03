import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPet, deletePet, getPet, listPets, updatePet, uploadPetFoto } from './pets-api';
import type { PetRequestDto } from '../pets.types';

export function usePets(params: { page: number; size: number; nome?: string }) {
  return useQuery({
    queryKey: ['pets', params],
    queryFn: () => listPets(params),
  });
}

export function usePet(id: string) {
  return useQuery({ queryKey: ['pet', id], queryFn: () => getPet(id), enabled: !!id });
}

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PetRequestDto) => createPet(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  });
}

export function useUpdatePet(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PetRequestDto) => updatePet(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pets'] });
      qc.invalidateQueries({ queryKey: ['pet', id] });
    },
  });
}

export function useDeletePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePet(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  });
}

export function useUploadPetFoto(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPetFoto(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pet', id] }),
  });
}
