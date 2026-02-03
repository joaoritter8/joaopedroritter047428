import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTutor,
  deleteTutor,
  getTutor,
  linkPet,
  listTutores,
  unlinkPet,
  updateTutor,
  uploadTutorFoto,
} from './tutores-api';
import type { TutorRequestDto } from '@/features/tutores/tutores.types';

export function useTutores(params: { page: number; size: number; nome?: string }) {
  return useQuery({ queryKey: ['tutores', params], queryFn: () => listTutores(params) });
}

export function useTutor(id: string) {
  return useQuery({ queryKey: ['tutor', id], queryFn: () => getTutor(id), enabled: !!id });
}

export function useCreateTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TutorRequestDto) => createTutor(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tutores'] }),
  });
}

export function useUpdateTutor(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TutorRequestDto) => updateTutor(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tutores'] });
      qc.invalidateQueries({ queryKey: ['tutor', id] });
    },
  });
}

export function useDeleteTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTutor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tutores'] }),
  });
}

export function useUploadTutorFoto(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadTutorFoto(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tutor', id] }),
  });
}

export function useLinkPet(tutorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => linkPet(tutorId, petId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tutor', tutorId] }),
  });
}

export function useUnlinkPet(tutorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => unlinkPet(tutorId, petId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tutor', tutorId] }),
  });
}
