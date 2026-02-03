export type FotoDto = {
  id: string;
  nome: string;
  contentType: string;
  url: string;
};

export type TutorResumoDto = {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cpf?: number;
  foto?: FotoDto;
};

export type PetDto = {
  id: string;
  nome: string;
  raca?: string;
  idade?: number;
  foto?: FotoDto;
};

export type PetCompletoDto = PetDto & {
  tutores?: TutorResumoDto[];
};

export type PagedResponse<T> = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
};

export type PetRequestDto = {
  nome: string;
  raca?: string;
  idade?: number;
};
